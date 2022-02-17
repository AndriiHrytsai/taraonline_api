'use strict';

const DbMixin = require('../mixins/db.mixin');
const AuthMixin = require('../mixins/auth.mixin');

const {
  Delivery,
  DeliveryList
} = require('../graphql/types/deliveries');

const {
  deliveries,
  delivery
} = require('../graphql/queries/deliveries');

const {
  createDelivery,
  updateDelivery,
  removeDelivery
} = require('../graphql/mutations/deliveries');

const {schema, fields} = require('../models/deliveries/delivery.model');
const {deliveryUpdated, deliveryCreated, deliveryDeleted} = require("../graphql/subscriptions/deliveries");

module.exports = {
  name: 'deliveries',

  /**
   * Mixins
   */
  mixins: [DbMixin('deliveries'), AuthMixin],

  /**
   * Settings
   */
  settings: {
    entityName: 'delivery',
    // Available fields in the responses
    fields: fields,
    // Validator for the `create` & `insert` actions.
    entityValidator: schema,
    entityRevisions: true,
    graphql: {
      type: [Delivery, DeliveryList],
      resolvers: {
        Delivery: {
          userId: {
            action: 'auth.read',
            rootParams: {
              userId: '_id'
            }
          },
          assets: {
            action: 'assets.getAsset',
            rootParams: {
              _id: 'itemId'
            }
          },
          deliveryRoutes: {
            action: 'deliveryRoutes.read',
            rootParams: {
              _id: '_id'
            }
          },
          conversationId: {
            action: 'conversations.readByItemId',
            rootParams: {
                userId: 'ownerId',
                _id: 'deliveryId'
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
   */
  actions: {
    create: {
      graphql: {
        mutation: createDelivery
      },
      async handler(ctx) {
        const {
          data: {userId, deliveryRoutes, ...restData}
        } = ctx.params;

        const delivery = await this.adapter.insert({
          ...restData,
          userId,
          createdAt: new Date(),
          createdBy: userId,
          isDeleted: false
        });

        if (deliveryRoutes?.length) {
          for await (const route of deliveryRoutes) {
            await ctx.call('deliveryRoutes.create', {
              data: {
                ...route,
                deliveryId: delivery._id,
              }
            });
          }
        }
        return delivery;
      }
    },
    update: {
      graphql: {
        mutation: updateDelivery
      },
      async handler(ctx) {
        const {_id, data: {userId, ...restData}} = ctx.params;

        return await this.adapter.updateById(_id, {...restData, modifiedAt: new Date(), modifiedBy: userId});
      }
    },
    delete: {
      graphql: {
        mutation: removeDelivery
      },
      async handler(ctx) {
        const previous = this.adapter.findById(ctx.params._id);
        await this.adapter.updateById(ctx.params._id, {isDeleted: true});
        return previous;
      }
    },
    read: {
      cache: {
        keys: ["_id"]
      },
      params: {
        _id: schema._id
      },
      graphql: {
        query: delivery
      },
      async handler(ctx) {
        let {_id: deliveryId} = ctx.params;
        const userId = ctx?.meta?.user?._id;
        const delivery = await this.adapter.findById(deliveryId);
        if (delivery) {
          delivery.canVote = await ctx.call('rankings.canVote', {
            itemId: deliveryId,
            ownerId: delivery.ownerId,
            userId
          });
        }
        return delivery;
      }
    },
    list: {
      graphql: {
        query: deliveries
      },
      cache: false,
      async handler(ctx) {
        const {page = 1, pageSize = 20, userId} = ctx.params;

        const offset = pageSize * (page - 1);

        let items = [];
        const query = {isDeleted: false};
        const sortField = {
          createdAt: -1,
        };

        if (userId) {
          query['userId'] = userId;
        }

        const filter = {
          limit: pageSize,
          offset,
          query,
          sort: sortField
        }

        items = await this.adapter.find(filter);
        const total = await this.adapter.count({query});

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
    createSub: {
      graphql: {
        subscription: deliveryCreated,
        tags: ['deliveryCreated']
      },
      async handler(ctx) {
        const payload = ctx.params.payload;
        const {userId} = ctx.params;

        return payload.userId !== userId ? payload : undefined;
      }
    },
    updateSub: {
      graphql: {
        subscription: deliveryUpdated,
        tags: ['deliveryUpdated'],
      },
      async handler(ctx) {
        const payload = ctx.params.payload;
        const {_id} = ctx.params;

        return payload._id === _id ? payload : undefined;
      }
    },
    deleteSub: {
      graphql: {
        subscription: deliveryDeleted,
        tags: ['deliveryDeleted']
      },
      async handler(ctx) {
        const payload = ctx.params.payload;
        const {userId} = ctx.params;

        return payload.userId !== userId ? payload : undefined;
      }
    }
  },

  /**
   * Action Hooks
   */
  hooks: {
    before: {},
    after: {
      async create(ctx, res) {
        await ctx.broadcast('graphql.publish', {
          tag: 'deliveryCreated',
          payload: res
        });
        return res;
      },
      async update(ctx, res) {
        await ctx.broadcast("graphql.publish", {
          tag: 'deliveryUpdated',
          payload: res,
        });
        return res;
      },
      async delete(ctx, res) {
        await ctx.broadcast('graphql.publish', {
          tag: 'deliveryDeleted',
          payload: res,
        });
        return res;
      }
    }
  },

  /**
   * Events
   */
  events: {},

  /**
   * Methods
   */
  methods: {
    /**
     * Loading sample data to the collection.
     * It is called in the DB.mixin after the database
     * connection establishing & the collection is empty.
     */
    async seedDB() {
    }
  },

  /**
   * Fired after database connection establishing.
   */
  async afterConnected() {
    /**
     * Create necessary indexes
     */
  },

  /**
   * Service created lifecycle event handler
   */
  created() {
  },

  /**
   * Service started lifecycle event handler
   */
  async started() {
  },

  /**
   * Service stopped lifecycle event handler
   */
  async stopped() {
  }
};
