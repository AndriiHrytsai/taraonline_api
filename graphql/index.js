'use strict';

const {Kind} = require('graphql');
const {ApolloService, GraphQLUpload} = require('moleculer-apollo-server');
const {moleculerGql: gql} = require('moleculer-apollo-server');

module.exports = ApolloService({
  // Global GraphQL typeDefs
  // eslint-disable-next-line
  typeDefs: [
    gql`
        scalar ID
    `,
    gql`
        scalar Date
    `,
    gql`
        scalar Timestamp
    `,
    gql`
        scalar Upload
    `
  ],

  // Global resolvers
  resolvers: {
    Date: {
      __parseValue(value) {
        return new Date(value); // value from the client
      },
      __serialize(value) {
        return value; // value sent to the client
      },
      __parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
          return parseInt(ast.value, 10); // ast value is always in string format
        }

        return null;
      }
    },
    Timestamp: {
      __parseValue(value) {
        return new Date(value); // value from the client
      },
      __serialize(value) {
        return value; // value sent to the client
      },
      __parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
          return parseInt(ast.value, 10); // ast value is always in string format
        }

        return null;
      }
    },
    Upload: GraphQLUpload,
  },

  // API Gateway route options
  routeOptions: {
    path: '/graphql',
    // Configures the Access-Control-Allow-Origin CORS header.
    cors: {
      origin: '*',
      methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization'
      ],
      exposedHeaders: [],
      credentials: false,
      maxAge: 3600
    },

    mappingPolicy: 'restrict',

    authentication: true,

    bodyParsers: {
      json: {
        strict: false,
        limit: '5MB'
      },
      urlencoded: {
        extended: true,
        limit: '5MB'
      }
    }
  },

  // https://www.apollographql.com/docs/apollo-server/v2/api/apollo-server.html
  serverOptions: {
    tracing: true,
    subscriptions: {
      path: '/subscriptions',
    },
    engine: {
      apiKey: process.env.APOLLO_ENGINE_KEY
    },
    uploads: {
      maxFiles: 10
    },
  }
});
