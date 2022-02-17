'use strict';

const DbMixin = require('../mixins/db.mixin');
const AuthMixin = require("../mixins/auth.mixin");
const {MoleculerClientError} = require('moleculer').Errors;
const {notification, notifications} = require('../graphql/queries/notifications');
const {
  createNotification,
  removeNotification,
  removeManyNotifications,
  updateNotification,
  updateManyNotifications
} = require('../graphql/mutations/notifications');
const {Notification, NotificationList} = require('../graphql/types/notifications');
const {schema, fields} = require('../models/notifications/notification.model');
const {
  notificationUpdated,
  notificationCreated,
  notificationDeleted
} = require("../graphql/subscriptions/notifications");

module.exports = {
  name: 'notifications',

  /**
   * Mixins
   */
  mixins: [DbMixin('notifications'), AuthMixin],

  /**
   * Settings
   */
  settings: {
    entityName: 'notifications',
    // Available fields in the responses
    fields: fields,
    // Validator for the `create` & `insert` actions.
    entityValidator: schema,
    entityRevisions: true,
    graphql: {
      type: [Notification, NotificationList],
      resolvers: {
        Notification: {
          userId: {
            action: 'auth.read',
            rootParams: {
              userId: '_id'
            }
          },
        }
      }
    }
  },

  /**
   * Dependencies
   */
  dependencies: [],

  /**
   * Actions
   * These actions using mixin javascript technology.
   * These are defined in db-mixins
   */
  actions: {
    create: {
      graphql: {
        mutation: createNotification
      },
      async handler(ctx) {
        const {
          data
        } = ctx.params;

        return await this.adapter.insert({...data, createdAt: new Date(), isDeleted: false});
      }
    },
    read: {
      cache: false,
      params: {
        _id: schema._id
      },
      graphql: {
        query: notification
      },
      async handler(ctx) {
        return await this.adapter.findById(ctx.params._id);
      }
    },
    delete: {
      graphql: {
        mutation: removeNotification
      },
      params: {
        _id: schema._id
      },
      async handler(ctx) {
        const {_id} = ctx.params;
        try {
          return await this.adapter.updateById(_id, {isDeleted: true});
        } catch (err) {
          console.error(err);
          return err.message;
        }
      }
    },
    removeManyNotifications: {
      graphql: {
        mutation: removeManyNotifications
      },
      async handler(ctx) {
        let {ids} = ctx.params;

        if (ids?.length) {
          try {
            ids = ids.map(id => this.stringToObjectID(id));
            const result = await this.adapter.find({query: {_id: {'$in': ids}}});
            await this.adapter.updateMany({_id: {'$in': ids}}, {isDeleted: true});
            return result;
          } catch (err) {
            console.error(err);
            return err.message;
          }
        } else {
          throw new MoleculerClientError('Notification IDs not provided!', 401);
        }
      }
    },
    updateNotification: {
      cache: false,
      graphql: {
        mutation: updateNotification
      },
      async handler(ctx) {
        const {_id} = ctx.params;
        return await this.adapter.updateById({_id}, {seen: true, updatedAt: new Date()});
      }
    },
    list: {
      cache: false,
      graphql: {
        query: notifications
      },
      async handler(ctx) {
        const {page = 1, pageSize = 10, userId, seen = false} = ctx.params;

        const offset = pageSize * (page - 1);
        const query = {
          isDeleted: false,
          userId
        };

        if (seen) {
          query['seen'] = seen;
        }

        const items = await this.adapter.find({
          query,
          order: {
            createdAt: 1
          },
          offset,
          limit: pageSize
        });

        const total = await this.adapter.count({query: {userId}});

        const totalPages = Math.ceil(total / pageSize);

        return {
          rows: items,
          page,
          pageSize,
          total,
          totalPages
        }
      }
    },
    updateManyNotifications: {
      cache: false,
      graphql: {
        mutation: updateManyNotifications
      },
      async handler(ctx) {
        let {ids} = ctx.params;
        if (ids?.length) {
          try {
            ids = ids.map(id => this.stringToObjectID(id));
            const result = await this.adapter.find({query: {_id: {'$in': ids}}});
            await this.adapter.updateMany({_id: {'$in': ids}}, {seen: true, updatedAt: new Date()});
            return result;
          } catch (err) {
            console.error(err);
            return err.message;
          }
        } else if (ids?.length) {
          throw new MoleculerClientError('Notification IDs not provided!', 401);
        }
      }
    },
    notificationUpdatedSub: {
      graphql: {
        subscription: notificationUpdated,
        tags: ['notificationUpdatedSub']
      },
      handler(ctx) {
        const payload = ctx.params.payload;
        const {userId} = ctx.params;
        return payload.userId === userId ? payload : undefined;
      }
    },
    notificationCreatedSub: {
      graphql: {
        subscription: notificationCreated,
        tags: ['notificationCreatedSub']
      },
      handler(ctx) {
        const payload = ctx.params.payload;
        const {userId} = ctx.params;
        return payload.userId === userId ? payload : undefined;
      }
    },
    notificationDeletedSub: {
      graphql: {
        subscription: notificationDeleted,
        tags: ['notificationDeletedSub']
      },
      handler(ctx) {
        const payload = ctx.params.payload;
        const {userId} = ctx.params;
        return payload.userId === userId ? payload : undefined;
      }
    },
  },

  /**
   * Events
   */
  events: {
    'messages.created': {
      handler(payload) {
        this.logger.info('messages created:', payload);
      }
    },
    'messages.updated': {
      handler(payload) {
        this.logger.info('messages updated:', payload);
      }
    },
    'messages.deleted': {
      handler(payload) {
        this.logger.info('messages deleted:', payload);
      }
    }
  },

  /**
   * Action Hooks
   */
  hooks: {
    before: {
      /**
       * Register a before hook for the `create` action.
       * It sets a default value for the count field.
       *
       * @param {Context} ctx
       */
      async create(ctx) {
        this.addCreateParams(ctx);
      }
    },
    after: {
      async create(ctx, res) {
        await ctx.broadcast('graphql.publish', {
          tag: 'notificationCreatedSub',
          payload: res
        });
        return res;
      },
      async update(ctx, res) {
        await ctx.broadcast('graphql.publish', {
          tag: 'notificationUpdatedSub',
          payload: res
        });
        return res;
      },
      async delete(ctx, res) {
        await ctx.broadcast('graphql.publish', {
          tag: 'notificationDeletedSub',
          payload: res
        });
        return res;
      },
    }
  },

  /**
   * Methods
   */
  methods: {},

  /**
   * Fired after database connection establishing.
   */
  async afterConnected() {
    this.logger.info('Message service connected successfully');
  },

  async created() {
  },

  async started() {
  },

  async stopped() {
  }
};
