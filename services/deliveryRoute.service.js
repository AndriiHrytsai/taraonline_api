'use strict';

const DbMixin = require('../mixins/db.mixin');
const AuthMixin = require('../mixins/auth.mixin');

const {
  DeliveryRoute,
  DeliveryRouteList
} = require('../graphql/types/deliveries');

const {
  deliveryRoutes,
  deliveryRoute
} = require('../graphql/queries/deliveries');

const {
  createDeliveryRoute,
  updateDeliveryRoute,
  removeDeliveryRoute
} = require('../graphql/mutations/deliveries');

const {schema, fields} = require('../models/deliveries/deliveryRoute.model')
const _ = require("lodash");

module.exports = {
  name: 'deliveryRoutes',

  /**
   * Mixins
   */
  mixins: [DbMixin('deliveryRoutes'), AuthMixin],

  /**
   * Settings
   */
  settings: {
    entityName: 'deliveryRoute',
    // Available fields in the responses
    fields: fields,
    // Validator for the `create` & `insert` actions.
    entityValidator: schema,
    entityRevisions: true,
    graphql: {
      type: [DeliveryRoute, DeliveryRouteList],
      resolvers: {
        DeliveryRoute: {
          deliveryId: {
            action: 'deliveries.read',
            rootParams: {
              _id: '_id'
            }
          },
          startAddress: {
            action: 'deliveryAddresses.read',
            rootParams: {
              startAddress: '_id'
            }
          },
          endAddress: {
            action: 'deliveryAddresses.read',
            rootParams: {
              endAddress: '_id'
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
        mutation: createDeliveryRoute
      },
      async handler(ctx) {
        const {
          data: {startAddress, endAddress, ...restData}
        } = ctx.params;
        const userId = ctx?.meta?.user?._id;

        let newStartAddress = '';
        let newEndAddress = '';

        if (startAddress) {
          newStartAddress = await ctx.call('deliveryAddresses.create', {
            data: startAddress
          });
        }

        if (endAddress) {
          newEndAddress = await ctx.call('deliveryAddresses.create', {
            data: endAddress
          });
        }

        return await this.adapter.insert({
          ...restData,
          startAddress: newStartAddress?._id,
          endAddress: newEndAddress?._id,
          createdAt: new Date(),
          createdBy: userId
        });
      }
    },
    update: {
      graphql: {
        mutation: updateDeliveryRoute
      },
      async handler(ctx) {
        const {_id, ...restData} = ctx.params;
        const userId = ctx?.meta?.user?._id;

        return await this.adapter.updateById(_id, {...restData, modifiedAt: new Date(), modifiedBy: userId});
      }
    },
    delete: {
      graphql: {
        mutation: removeDeliveryRoute
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
        query: deliveryRoute
      },
      async handler(ctx) {
        const filter = {
          query: {
            deliveryId: ctx.params._id
          }
        };
        return await this.adapter.find(filter);
      }
    },
    list: {
      graphql: {
        query: deliveryRoutes
      },
      cache: false,
      async handler(ctx) {
        const {page = 1, pageSize = -1, deliveryId} = ctx.params;

        const offset = pageSize * (page - 1);

        const query = {};
        const items = [];

        if (deliveryId) {
          query['deliveryId'] = deliveryId;
        }


        const filter = {
          limit: pageSize,
          offset,
          query
        }

        const result = await this.adapter.find(filter)
        items.push(...result)

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
