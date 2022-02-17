'use strict';

const fs = require('fs');
const ApiGateway = require('moleculer-web');
const ApolloService = require('../graphql');
const PassportMixin = require('../passport');
const GrpcService = require('../grpc');
const AuthMixin = require('../mixins/auth.mixin');
const {MoleculerError} = require('moleculer').Errors;
const socketIo = require('socket.io');
const http = require('http');
const redisAdapter = require('socket.io-redis');
const refreshStrategy = require('passport-oauth2-refresh');
const {omit} = require('lodash');
const {redisPub, redisSub} = require('../redis');

module.exports = {
  name: 'api',
  mixins: [ApiGateway, ApolloService, GrpcService, PassportMixin, AuthMixin],

  settings: {
    port: process.env.PORT || 3000,

    use: [
      function (req, res, next) {
        if (req.query && req.query.socketId) {
          this.socketId = req.query.socketId;
        }
        next();
      }
    ],

    // Configures the Access-Control-Allow-Origin CORS header.
    cors: {
      origin: '*',
      methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
      exposedHeaders: [],
      credentials: false,
      maxAge: 3600
    },

    routes: [
      {
        path: '/api',

        whitelist: ['**'],
        mappingPolicy: 'restrict',

        camelCaseNames: true,

        authorization: true,

        aliases: {},

        // Use bodyparser modules
        bodyParsers: {
          json: {limit: '5MB'},
          urlencoded: {extended: true, limit: '5MB'}
        }
      }
    ],

    // Do not log client side errors (does not log an error response when the error.code is 400<=X<500)
    log4XXResponses: false,
    // Logging the request parameters. Set to any log level to enable it. E.g. "info"
    logRequestParams: null,
    // Logging the response data. Set to any log level to enable it. E.g. "info"
    logResponseData: null,

    // Serve assets from "public" folder. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Serve-static-files
    assets: {
      folder: 'public',

      // Options to `server-static` module
      options: {}
    }
  },

  hooks: {
    after: {}
  },

  actions: {
    ws: {
      timeout: 0,
      visibility: 'public',
      tracing: {
        tags: {
          params: ['socket.upgradeReq.url']
        },
        spanName: (ctx) => `UPGRADE socket ${ctx.params.socket.upgradeReq.url}`
      },
      async handler(ctx) {
        const {socket, connectionParams} = ctx.params;
        const auth = connectionParams['authorization'] || '';
        if (auth && auth.startsWith('Bearer')) {
          const token = auth.slice(7);

          const currentUser = await ctx.call('auth.resolveToken', {token});

          ctx.meta.user = currentUser ? currentUser : null;
          if (currentUser) {
            return {
              $ctx: ctx,
              $socket: socket,
              $service: this,
              $params: {body: connectionParams, query: socket.upgradeReq.query}
            };
          }
          throw new MoleculerError('Invalid access token!', 401, 'INVALID_TOKEN');
        }

        return {
          $ctx: ctx,
          $socket: socket,
          $service: this,
          $params: {body: connectionParams, query: socket.upgradeReq.query}
        };
      }
    },
    refreshToken: {
      visibility: 'public',
      async handler(ctx) {
        const {provider, refreshToken} = ctx.params;

        return new Promise((resolve, reject) =>
          refreshStrategy.requestNewAccessToken(provider, refreshToken, (err, accessToken, refreshToken = undefined) => {
            if (err || !accessToken) {
              return reject(new Error('AccessToken is not generated'));
            }
            const object = {accessToken, refreshToken: refreshToken ? refreshToken : false};
            return resolve(object);
          })
        );
      }
    }
  },

  methods: {
    async signInSocialUser(params, cb) {
      try {
        this.broker
          .call('auth.socialLogin', params)
          .then((res) => {
            this.logger.info(params.socketId, res);
            const response = omit(res, ['googleToken']);
            this.io.in(params.socketId).emit('google', response);
            cb(null, res);
          })
          .catch((error) => {
            this.logger.error(error);
            this.io.in(params.socketId).emit('google', {error});
            cb(error);
          });
      } catch (err) {
        cb(err);
      }
    },
    signInPhoneUser(params, cb) {
      try {
        this.broker
          .call('auth.socialLogin', params)
          .then((res) => {
            this.logger.info(params.phoneNumber, res);
            cb(null, params.profile);
          })
          .catch((error) => {
            this.logger.error(error);
            cb(error);
          });
      } catch (err) {
        cb(err);
      }
    },
  },

  events: {
    '**'(payload, sender, event) {
      if (this.io) {
        this.io.emit('event', {
          sender,
          event,
          payload
        });
      }
    },
    'graphql.schema.updated'({schema}) {
      fs.writeFileSync(__dirname + '/generated-schema.gql', schema, 'utf8');
      this.logger.info('GraphQL schema is updated!');
    },
    'graphql.*'({tag, payload}) {
      this.logger.info('GraphQL schema is published! ', tag, payload);
      return {tag, payload};
    }
  },

  async created() {
    const server = http.createServer();
    this.io = socketIo(server, {
      origins: '*:*',
      cookie: 'loginIO'
    });
    this.io.adapter(redisAdapter({pubClient: redisPub, subClient: redisSub}));

    this.io.on('connection', (socket) => {
      // eslint-disable-next-line no-console
      console.log('Auth socket connected with ', socket.id);

      socket.on('disconnect', () => {
        // eslint-disable-next-line no-console
        console.log('Auth socket disconnected! ', socket.id);
      });

      socket.on('error', (error) => {
        // eslint-disable-next-line no-console
        console.log('Auth Socket error: ', error);
      });
    });

    server.listen(process.env.AUTH_SOCKET_PORT || 8888, (err) => {
      if (err) {
        return this.logger.error('Unable to start socket server', err);
      }



      this.logger.info('');
      this.logger.info('Socket server listening on');
      this.logger.info(`    http://localhost:${process.env.AUTH_SOCKET_PORT || 8888}`);
      this.logger.info('');
    });
  },

  async started() {
    this.logger.info('----------------------------------------------------------');
    this.logger.info(`Open the http://localhost:${this.settings.port}/graphql URL in your browser`);
    this.logger.info('----------------------------------------------------------');
  },

  async stopped() {
  }
};
