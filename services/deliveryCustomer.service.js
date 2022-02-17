'use strict';

const DbMixin = require('../mixins/db.mixin');
const AuthMixin = require('../mixins/auth.mixin');

const {
  DeliveryCustomer,
  DeliveryCustomerList
} = require('../graphql/types/deliveries');

const {
  deliveryCustomers,
  deliveryCustomer
} = require('../graphql/queries/deliveries');

const {
  createDeliveryCustomer
} = require('../graphql/mutations/deliveries');

const {schema, fields} = require('../models/deliveries/deliveryCustomer.model')
const _ = require("lodash");

module.exports = {
  name: 'deliveryCustomers',

  /**
   * Mixins
   */
  mixins: [DbMixin('deliveryCustomers'), AuthMixin],

  /**
   * Settings
   */
  settings: {
    entityName: 'deliveryCustomer',
    // Available fields in the responses
    fields: fields,
    // Validator for the `create` & `insert` actions.
    entityValidator: schema,
    entityRevisions: true,
    graphql: {
      type: [DeliveryCustomer, DeliveryCustomerList],
      resolvers: {
        DeliveryCustomer: {
          deliveryId: {
            action: 'deliveries.read',
            rootParams: {
              deliveryId: '_id'
            }
          },
          customerId: {
            action: 'auth.read',
            rootParams: {
              customerId: '_id'
            }
          },
          conversationId: {
            action: 'conversations.read',
            rootParams: {
              conversationId: '_id'
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
        mutation: createDeliveryCustomer
      },
      async handler(ctx) {
        const {
          data: {message, ...restData}
        } = ctx.params;
        const userId = ctx?.meta?.user?._id;
        let customer = null;

        if (restData?.customerId !== restData?.ownerId) {
          customer = await this.adapter.insert({...restData, createdAt: new Date(), createdBy: userId});
          const delivery = await ctx.call('deliveries.read', {_id: restData.deliveryId});
          const conversation = await ctx.call('conversations.create', {
            data: {
              members: [restData.customerId, restData.ownerId],
              name: delivery?.name,
              type: 'private',
              deliveryCustomerId: customer._id,
              deliveryId: restData.deliveryId
            }
          });

          await this.adapter.updateById(customer._id, {conversationId: conversation._id});
          customer.conversationId = conversation._id;
          await ctx.call('messages.create', {
            data: {
              conversationId: conversation._id,
              userId,
              message
            }
          });
        }

        return customer;
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
        query: deliveryCustomer
      },
      async handler(ctx) {
        let _id = ctx.params._id;

        let result = _.cloneDeep(
          await this.adapter.findById(_id)
        );

        if (result) {
          return result;
        }
      }
    },
    findByUsers: {
      async handler(ctx) {
        const {_id, ownerId, customerId, productId} = ctx.params;
        const query = {
          '$or': [
            {ownerId: ownerId, customerId: customerId, productId},
            {ownerId: customerId, customerId: ownerId, productId }
          ]
        };

        if (_id) {
          query['_id'] = _id;
        }

        return await this.adapter.findOne(query);
      }
    },
    list: {
      graphql: {
        query: deliveryCustomers
      },
      cache: false,
      async handler(ctx) {
        const {page = 1, pageSize = -1} = ctx.params;

        const offset = pageSize * (page - 1);

        const query = {};
        const items = [];

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
