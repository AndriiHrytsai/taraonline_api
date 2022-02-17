'use strict';

const DbMixin = require('../mixins/db.mixin');
const AuthMixin = require('../mixins/auth.mixin');

const {
  DeliveryAddress,
  DeliveryAddressList
} = require('../graphql/types/deliveries');

const {
  deliveryAddresses,
  deliveryAddress
} = require('../graphql/queries/deliveries');

const {
  createDeliveryAddress
} = require('../graphql/mutations/deliveries');

const {
  updateDeliveryAddress,
  removeDeliveryAddress
} = require("../graphql/mutations/deliveries");

const {schema, fields} = require('../models/deliveries/deliveryAddress.model')
const _ = require("lodash");

module.exports = {
  name: 'deliveryAddresses',

  /**
   * Mixins
   */
  mixins: [DbMixin('deliveryAddresses'), AuthMixin],

  /**
   * Settings
   */
  settings: {
    entityName: 'deliveryAddress',
    // Available fields in the responses
    fields: fields,
    // Validator for the `create` & `insert` actions.
    entityValidator: schema,
    entityRevisions: true,
    graphql: {
      type: [DeliveryAddress, DeliveryAddressList],
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
        mutation: createDeliveryAddress
      },
      async handler(ctx) {
        const {
          data
        } = ctx.params;
        const userId = ctx?.meta?.user?._id;
        return await this.adapter.insert({...data, createdAt: new Date(), createdBy: userId});
      }
    },
    update: {
      graphql: {
        mutation: updateDeliveryAddress
      },
      async handler(ctx) {
        const {_id, ...restData} = ctx.params;
        const userId = ctx?.meta?.user?._id;

        return await this.adapter.updateById(_id, {...restData, modifiedAt: new Date(), modifiedBy: userId});
      }
    },
    delete: {
      graphql: {
        mutation: removeDeliveryAddress
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
        query: deliveryAddress
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
    list: {
      graphql: {
        query: deliveryAddresses
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
