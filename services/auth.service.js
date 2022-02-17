"use strict";

const {MoleculerClientError, MoleculerError} = require('moleculer').Errors;
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const {generateJWT, verifyJWT} = require('../jwt');
const mail = require('./../utils/mail');
const DbMixin = require("../mixins/db.mixin");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const AuthMixin = require("../mixins/auth.mixin");
const {
  User,
  LoginResponse,
  RefreshTokenResponse,
  CreateUserResponse,
  UserResponse,
  UserList
} = require("../graphql/types/users");
const {
  createUser,
  updateUser,
  forgotPassword,
  resetPassword,
  sendActivationLink,
  activateAccount, changePassword, changeUserRole, banUser
} = require("../graphql/mutations/users");
const {
  login,
  user,
  users
} = require("../graphql/queries/users");
const {schema, fields} = require('../models/users/users.model');
const {fileUploader} = require("../utils");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
  name: "auth",

  /**
   * Mixins
   */
  mixins: [DbMixin("users"), AuthMixin],

  /**
   * Settings
   */
  settings: {
    entityName: "user",
    // Available fields in the responses
    fields: fields,

    // Validator for the `create` & `insert` actions.
    entityValidator: schema,
    entityRevisions: true,
    graphql: {
      type: [User, LoginResponse, RefreshTokenResponse, CreateUserResponse, UserResponse, UserList],
      resolvers: {
        UserResponse: {
          avatar: {
            action: 'assets.getAsset',
            rootParams: {
              _id: 'userId'
            }
          },
          ranking: {
            action: 'rankings.getRanking',
            rootParams: {
              _id: 'userId'
            }
          }
        },
        User: {
          avatar: {
            action: 'assets.getAsset',
            rootParams: {
              _id: 'userId'
            }
          },
          ranking: {
            action: 'rankings.getRanking',
            rootParams: {
              _id: 'userId'
            }
          },
          counts: {
            action: 'products.getCounts',
            rootParams: {
              _id: 'userId'
            }
          },
          warehouses: {
            action: 'warehouses.getWarehouses',
            rootParams: {
              _id: 'userId'
            }
          },
        }
      }
    },
  },

  /**
   * Action Hooks
   */
  hooks: {
    before: {
      "*": ["checkUserRole"],
    },
    after: {}
  },

  /**
   * Actions
   */
  actions: {
    unlockUser: {
      params: {
        userId: 'string'
      },
      async handler(ctx) {
        const {userId} = ctx.params;
        return await this.adapter.updateById(userId, {banned: false, banExpiration: null});
      }
    },
    banUser: {
      role: ['admin', 'moderator'],
      graphql: {
        mutation: banUser
      },
      async handler(ctx) {
        const {userId, banExpiration} = ctx.params;
        const user = await ctx.call('auth.read', {_id: userId});
        if (!user)
          throw new MoleculerError(
            "User not found!",
            404,
            "USER_NOT_FOUND",
            {
              userId,
            }
          );

        if (user.role === 'admin' || user.role === 'moderator')
          throw new MoleculerClientError('User not have permission for this action!', 403, 'FORBIDDEN');

        return await this.adapter.updateById(userId, {banned: true, banExpiration: new Date(banExpiration)});
      }
    },
    changeUserRole: {
      role: ['admin'],
      graphql: {
        mutation: changeUserRole
      },
      async handler(ctx) {
        const {userId, role} = ctx.params;

        const user = await ctx.call('auth.read', {_id: userId});
        if (!user) {
          throw new MoleculerError(
            "User not found!",
            404,
            "USER_NOT_FOUND",
            {
              userId,
            }
          );
        }

        return await this.adapter.updateById(userId, {role});
      }
    },
    forgotPassword: {
      graphql: {
        mutation: forgotPassword
      },
      params: {
        email: "string",
      },
      async handler(ctx) {
        const {email} = ctx.params;

        let user = await this.adapter.findOne({email: email});

        if (!user) {
          throw new MoleculerError(
            "User not found!",
            404,
            "USER_NOT_FOUND",
            {
              email,
            }
          );
        }
        const {hashToken, resetToken, resetExpire} = this.getRandomToken();
        await this.adapter.updateById(user._id,
          {
            resetPasswordToken: hashToken,
            resetPasswordExpire: resetExpire
          });

        const resetUrl = process.env.UI_URL + "/changePassword/" + resetToken;

        const content = `
            <div>
                <h1>You are receiving this email because you (or someone else) has requested the reset of a password.</h1>
                <a href="${resetUrl}">Reset Password</a>
            </div>
        `;

        const subject = 'Reset password on TaraOnline';

        try {
          await mail.sendResetLinkToEmail(user.email, subject, content);
          return {
            status: "EMAIL_SENT",
          };
        } catch (err) {
          console.error(err);
          await this.adapter.updateById(user._id, {resetPasswordToken: null, resetPasswordExpire: null});
          return {
            status: "EMAIL_NOT_SENT",
          };
        }
      },
    },
    resetPassword: {
      graphql: {
        mutation: resetPassword
      },
      params: {
        resetToken: 'string',
        password: "string"
      },
      async handler(ctx) {
        const {resetToken, password} = ctx.params;

        const resetPasswordToken = crypto
          .createHash('sha256')
          .update(resetToken)
          .digest('hex');

        const user = await this.adapter.findOne({
          resetPasswordToken,
          resetPasswordExpire: {$gt: Date.now()}
        });

        if (!user) {
          throw new MoleculerError(
            "Invalid token!",
            500,
            "INVALID_TOKEN",
          );
        }

        await this.adapter.updateById(user._id, {
          resetPasswordToken: null,
          resetPasswordExpire: null,
          password: await this.hashPassword(password)
        });
        return {
          status: 'PASSWORD_CHANGED'
        }
      }
    },
    sendActivationLink: {
      graphql: {
        mutation: sendActivationLink
      },
      params: {
        email: "string",
      },
      async handler(ctx) {
        const {email} = ctx.params;

        let user = await this.adapter.findOne({email: email});

        if (!user) {
          throw new MoleculerError(
            "User not found!",
            404,
            "USER_NOT_FOUND",
            {
              email,
            }
          );
        }
        const {hashToken, resetToken: activateToken, resetExpire} = this.getRandomToken();
        await this.adapter.updateById(user._id,
          {
            activationToken: hashToken,
            activationTokenExpire: resetExpire
          });

        const activationUrl = process.env.UI_URL + "/activateEmail/" + activateToken;

        const content = `
            <div>
                <h1>Activate your email address on TaraOnline.</h1>
                <a href="${activationUrl}">Activate</a>
            </div>
        `;

        const subject = 'Activation on TaraOnline';

        try {
          await mail.sendResetLinkToEmail(user.email, subject, content);
          return {
            status: "EMAIL_SENT",
          };
        } catch (err) {
          await this.adapter.updateById(user._id, {activationToken: null, activationTokenExpire: null});
          return {
            status: "EMAIL_NOT_SENT",
          };
        }
      },
    },
    activateAccount: {
      graphql: {
        mutation: activateAccount
      },
      params: {
        resetToken: 'string',
      },
      async handler(ctx) {
        const {resetToken} = ctx.params;

        const activationToken = crypto
          .createHash('sha256')
          .update(resetToken)
          .digest('hex');

        const user = await this.adapter.findOne({
          activationToken,
          activationTokenExpire: {$gt: Date.now()}
        });

        if (!user) {
          throw new MoleculerError(
            "Invalid token!",
            500,
            "INVALID_TOKEN",
          );
        }

        await this.adapter.updateById(user._id, {
          activationToken: null,
          activationTokenExpire: null,
          emailVerified: true
        });
        return {
          status: 'ACCOUNT_ACTIVATED'
        }
      }
    },
    login: {
      params: {
        email: "string",
        password: "string",
      },
      graphql: {
        query: login,
      },
      async handler(ctx) {
        let email = ctx.params.email;
        let password = ctx.params.password;
        let currentUser = await this.adapter.findOne({
          email
        });
        if (!currentUser) {
          throw new MoleculerError(
            "Invalid email or password",
            401,
            "INVALID_EMAIL_OR_PASSWORD"
          );
        }
        let isPasswordValid = await this.isPasswordValid(email, password);

        if (!isPasswordValid) {
          throw new MoleculerError(
            "Wrong password!",
            401,
            "WRONG_PASSWORD",
            {email}
          );
        }

        const isBetaUser = await this.checkIfUserIsBeta(ctx, email);
        if (!isBetaUser) {
          throw new MoleculerClientError('User is not beta tester!', 401, 'ERR_ACCOUNT_NOT_IN_BETA');
        }

        if (currentUser) {
          //check if user exist group chat and if no add user to group chat
          await ctx.call('conversations.checkUserInGroupChat', {userId: currentUser._id});
          await this.adapter.updateById(currentUser._id, { lastLoginAt: new Date() })
          const accessToken = await generateJWT(currentUser);
          return {
            currentUser: {...currentUser},
            accessToken: accessToken,
            inBeta: isBetaUser
          };
        }
      },
    },
    create: {
      graphql: {
        mutation: createUser,
      },
      async handler(ctx) {
        const {email, username, password} = ctx.params;
        const newUserObj = {email, username};
        newUserObj.createdAt = new Date();
        newUserObj.lastLoginAt = new Date();
        newUserObj.role = 'user';
        newUserObj.isDeleted = false;
        newUserObj.emailVerified = false;
        newUserObj.password = await this.hashPassword(password);
        const response = await this.adapter.insert(newUserObj);
        const accessToken = await generateJWT(response);
        await ctx.call('auth.sendActivationLink', {email});

        await ctx.call('betaUsers.create', { email });


        return {currentUser: {...response}, accessToken: accessToken};
      },
    },
    changePassword: {
      graphql: {
        mutation: changePassword,
      },
      async handler(ctx) {
        const {prevPassword, newPassword} = ctx.params;
        const userId = ctx.meta.user._id;
        const user = await this.adapter.findById(userId);
        if (!user) throw new MoleculerClientError('User not found!', 404, 'USER_NOT_FOUND');

        const isPasswordValid = await this.isPasswordValid(user.email, prevPassword);

        if (!isPasswordValid) {
          throw new MoleculerError(
            "Wrong password!",
            510,
            "WRONG_PASSWORD",
            {email}
          );
        }

        return await this.adapter.updateById(user._id, {password: await this.hashPassword(newPassword)});
      }
    },
    update: {
      graphql: {
        mutation: updateUser,
        fileUploadArg: "file",
      },
      async handler(ctx) {
        let ctxData;

        if (ctx?.meta?.$args) {
          ctxData = ctx.meta.$args;
        } else {
          ctxData = ctx.params;
        }

        const {_id, data} = ctxData;

        if (ctx?.meta?.$args) {
          const prevAvatar = await ctx.call('assets.getAsset', {userId: _id});
          if (prevAvatar) {
            await ctx.call('assets.removeAsset', {_id: prevAvatar?._id});
          }

          const fileChunks = [];
          for await (const chunk of ctx.params) {
            fileChunks.push(chunk);
          }
          const buffer = Buffer.concat(fileChunks);
          const {key, url, mime} = await fileUploader.getDataForUpload('user', _id, buffer);
          await fileUploader.upload(buffer, key, mime);
          await ctx.call('assets.create', {
            mime,
            itemId: _id,
            url
          });
        }

        return await this.adapter.updateById(_id, {...data, modifiedAt: new Date()});
      },
    },
    findByQuery: {
      auth: true,
      async handler(ctx) {
        return this.adapter.find({query: ctx.params.query, limit: ctx.params.limit});
      }
    },
    read: {
      auth: true,
      cache: false,
      graphql: {
        query: user,
      },
      async handler(ctx) {
        let result;
        let _id = ctx.params._id;
        if (_id && _.isArray(_id)) {
          const query = {
            _id: {
              $in: _id.map((id) => {
                return this.adapter.stringToObjectID(id);
              })
            }
          };
          result = await this.adapter.find({query});
        } else if (_id) {
          result = await this.adapter.findById(_id);
        }

        if (result && _.isArray(result)) {
          return result;
        } else if (result) {
          delete result.isDeleted;
          return result;
        }
        throw new MoleculerError(
          "User not found!",
          404,
          "USER_NOT_FOUND",
          {
            user,
          }
        );
      },
    },
    list: {
      auth: true,
      cache: false,
      graphql: {
        query: users,
      },
      async handler(ctx) {
        const {
          page = 1,
          pageSize = 20,
          userId,
          location,
          username,
          createdAt,
          modifiedAt,
          lastLoginAt,
          sort,
          onlyActive,
          role
        } = ctx.params;

        const ctxUserId = ctx.meta.user._id;

        const offset = pageSize * (page - 1);

        const query = { $or: [] };
        const sortField = { };
        let items = [];

        if (userId) {
          query['userId'] = userId;
        }

        if (role) {
          query['role'] = role;
        }

        if (location) {
          query['location.placeId'] = location;
        }

        if (onlyActive) {
          // query['counts'] = { $gt: 0 };
        }

        if (username) {
          const users = await ctx.call('auth.findByQuery', {
            query: {
              username: {
                $regex: '.*' + username + '.*',
                $options: 'i'
              }
            },
            limit: pageSize
          });

          const ids = users?.map((user) => this.adapter.stringToObjectID(user._id));

          if (ids?.length > 1) {
            ids.map(( _id ) => {
              query['$or'].push({ _id })
            });
          } else if (ids?.length) {
            query['_id'] = ids[0];
          }
        }

        if (lastLoginAt?.from && lastLoginAt?.to) {
          query['$and'] = [{
            lastLoginAt: {
              $gte: new Date(lastLoginAt.from)
            }
          },
            {
              lastLoginAt: {
                $lte: new Date(lastLoginAt.to)
              }
            }];
        } else if (lastLoginAt?.from && !lastLoginAt?.to) {
          query['lastLoginAt'] = {$gte: new Date(lastLoginAt.from)};
        } else if (!lastLoginAt?.from && lastLoginAt?.to) {
          query['lastLoginAt'] = {$lte: new Date(lastLoginAt.to)};
        }

        if (modifiedAt?.from && modifiedAt?.to) {
          query['$and'] = [{
            modifiedAt: {
              $gte: new Date(modifiedAt.from)
            }
          },
            {
              modifiedAt: {
                $lte: new Date(modifiedAt.to)
              }
            }];
        } else if (modifiedAt?.from && !modifiedAt?.to) {
          query['modifiedAt'] = {$gte: new Date(modifiedAt.from)};
        } else if (!modifiedAt?.from && modifiedAt?.to) {
          query['modifiedAt'] = {$lte: new Date(modifiedAt.to)};
        }

        if (createdAt?.from && createdAt?.to) {
          query['$and'] = [{
            createdAt: {
              $gte: new Date(createdAt.from)
            }
          },
            {
              createdAt: {
                $lte: new Date(createdAt.to)
              }
            }];
        } else if (createdAt?.from && !createdAt?.to) {
          query['createdAt'] = {$gte: new Date(createdAt.from)};
        } else if (!createdAt?.from && createdAt?.to) {
          query['createdAt'] = {$lte: new Date(createdAt.to)};
        }

        if (!query['$or']?.length) {
          delete query['$or'];
        }

        if (sort?.field && sort?.value) {
          if (sort?.field === 'title') {
            sortField['userId'] = Number(sort.value);
          } else {
            sortField[sort.field] = Number(sort.value);
          }
        } else {
          sortField['lastLoginAt'] = -1;
        }

        if (!query['$or']?.length) {
          delete query['$or'];
        }

        const filter = {
          limit: pageSize,
          offset,
          query,
          sort: sortField,
        };

        items = await this.adapter.find(filter);
        const total = await this.adapter.count({ query });

        const totalPages = Math.ceil(total / pageSize);

        return {
          rows: items,
          page,
          pageSize,
          total,
          totalPages
        };
      }
    },
    socialLogin: {
      handler(ctx) {
        const {provider, accessToken, refreshToken, profile} = ctx.params;
        switch (provider) {
          case 'google':
            return this.googleCallback(ctx, profile, accessToken, refreshToken);
          case 'facebook':
          case 'twitter':
          case 'github':
          default:
            return null;
        }
      }
    },
    resolveToken: {
      params: {
        token: 'string'
      },
      async handler(ctx) {
        const decoded = await verifyJWT(ctx.params.token);
        if (!decoded.id) {
          throw new MoleculerClientError('Invalid token', 401, 'INVALID_TOKEN');
        }

        const user = await this.getById(decoded.id);
        if (!user) {
          throw new MoleculerClientError('User is not registered', 401, 'USER_NOT_FOUND');
        }

        const isBetaUser = await this.checkIfUserIsBeta(ctx, user.email);
        if (!isBetaUser) {
          throw new MoleculerClientError('User is not beta tester!', 401, 'ERR_ACCOUNT_NOT_IN_BETA');
        }

        // if (user.status !== 1) {
        //   throw new MoleculerClientError('User is disabled', 401, 'USER_DISABLED');
        // }

        return user;
      }
    },

    /**
     * The "moleculer-db" mixin registers the following actions:
     *  - list
     *  - find
     *  - count
     *  - create
     *  - insert
     *  - update
     *  - remove
     */
  },

  /**
   * Methods
   */
  methods: {
    getRandomToken() {
      const resetToken = crypto.randomBytes(20).toString('hex');
      const hashToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
      const resetExpire = Date.now() + 10 * 60 * 1000;

      return {
        resetToken,
        hashToken,
        resetExpire
      };
    },
    async checkIfUserIsBeta(ctx, email) {
      try {
        const isExists = await ctx.call('betaUsers.read', {email});
        if (isExists) {
          return true;
        }
        console.log('User not exits in Beta list: ', email);
        return false;
      } catch (e) {
        console.log('Error ', e);
        return false;
      }
    },
    async hashPassword(password) {
      if (password) {
        return await bcrypt.hash(
          password,
          8
        );
      }
    },
    async isPasswordValid(email, password) {
      let user = await this.adapter.findOne({
        email,
        isDeleted: false,
      });
      if (!user) {
        return false;
      }
      return await bcrypt.compare(password, user.password);
    },
    signKey(user, expireInMinutes, secret) {
      return jwt.sign(
        {
          exp: Math.floor(Date.now() / 1000) + 60 * expireInMinutes,
          payload: {
            user,
          },
        },
        secret
      );
    },
    decodeKey(token, secret) {
      try {
        jwt.verify(token, secret);
        return true;
      } catch (error) {
        return false;
      }
    },
    async googleCallback(ctx, profile) {
      const user = {
        username: profile.email.split('@')[0],
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        googleId: profile.socialID,
        avatar: profile.avatar,
        status: 'signed_up',
        lastLoginAt: new Date(),
        emailVerified: true
      };

      let result = await this.adapter.findByValue('email', profile.email);

      if (!result) {
        //create new user
        user.createdAt = new Date();
        result = await this.adapter.insert(user);

        await ctx.call('assets.create', {
          mime: 'image/png',
          itemId: result._id,
          url: profile.avatar
        });
      } else if (result) {
        const updatedFields = _.pick(user, ['status', 'lastLoginAt']);
        result = await this.adapter.updateById(result._id, updatedFields);
      }

      if (result) {
        this.broker.emit('user.created', result, ['search']);
        const isBetaUser = await this.checkIfUserIsBeta(ctx, result.email);
        if (!isBetaUser) {
          throw new MoleculerClientError('User is not beta tester!', 401, 'ERR_ACCOUNT_NOT_IN_BETA');
        }

        await ctx.call('conversations.checkUserInGroupChat', {userId: result._id});
        const accessToken = await generateJWT(result);
        return {
          currentUser: {...result},
          accessToken: accessToken,
          inBeta: isBetaUser
        };
      } else {
        return null;
      }
    },
    /**
     * Loading sample data to the collection.
     * It is called in the DB.mixin after the database
     * connection establishing & the collection is empty.
     */
    async seedDB() {
      const DATE = new Date();
      await this.adapter.insertMany([
        {
          username: 'Misha',
          email: 'misha.tret.ua@gmail.com',
          password: '$2a$08$jiJzeITeicWeenYTQgz7wu/db7ZLZsqVB8L1nbtue7Y23wwEsPcti',
          role: "admin",
          emailVerified: true,
          createdAt: DATE,
          lastLoginAt: DATE,
          isDeleted: false
        },
        {
          username: 'Bogdan',
          email: 'bogdan.senkiv@gmail.com',
          password: '$2a$08$jiJzeITeicWeenYTQgz7wu/db7ZLZsqVB8L1nbtue7Y23wwEsPcti',
          role: "admin",
          emailVerified: true,
          createdAt: DATE,
          lastLoginAt: DATE,
          isDeleted: false
        },
        {
          username: 'Petro',
          email: 'petershevchuk@azon5.com',
          password: '$2a$08$jiJzeITeicWeenYTQgz7wu/db7ZLZsqVB8L1nbtue7Y23wwEsPcti',
          role: "admin",
          emailVerified: true,
          createdAt: DATE,
          lastLoginAt: DATE,
          isDeleted: false
        },
        {
          username: 'Andriy',
          email: 'atretiak.work@gmail.com',
          password: '$2a$08$jiJzeITeicWeenYTQgz7wu/db7ZLZsqVB8L1nbtue7Y23wwEsPcti',
          role: "admin",
          emailVerified: true,
          createdAt: DATE,
          lastLoginAt: DATE,
          isDeleted: false
        },
        {
          username: 'Tester',
          email: 'bank201008@gmail.com',
          password: '$2a$08$jiJzeITeicWeenYTQgz7wu/db7ZLZsqVB8L1nbtue7Y23wwEsPcti',
          role: "admin",
          emailVerified: true,
          createdAt: DATE,
          lastLoginAt: DATE,
          isDeleted: false
        }
      ]);
    },
  },

  /**
   * Fired after database connection establishing.
   */
  async afterConnected() {
    /**
     * Create necessary indexes
     */
    await this.adapter.collection.createIndex(
      {email: 1},
      {unique: true}
    );
  },
};
