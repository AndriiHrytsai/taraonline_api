'use strict';
const DbMixin = require('../mixins/db.mixin');
const AuthMixin = require('../mixins/auth.mixin');

const {
  Warehouse,
  Warehouses
} = require('../graphql/types/users');

const {
  warehouses,
  warehouse
} = require('../graphql/queries/users');

const {
  createWarehouse,
  updateWarehouse,
  removeWarehouse
} = require('../graphql/mutations/users');

const {schema, fields} = require('../models/users/warehouse.model')
const _ = require("lodash");

module.exports = {
  name: 'warehouses',

  /**
   * Mixins
   */
  mixins: [DbMixin('warehouses'), AuthMixin],

  /**
   * Settings
   */
  settings: {
    entityName: 'warehouses',
    // Available fields in the responses
    fields: fields,
    // Validator for the `create` & `insert` actions.
    entityValidator: schema,
    entityRevisions: true,
    graphql: {
      type: [Warehouse, Warehouses],
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
        mutation: createWarehouse
      },
      async handler(ctx) {
        const { data } = ctx.params;
        const userId = ctx?.meta?.user?._id;

        return await this.adapter.insertMany(
            data.map((prevData) => ({
              ...prevData,
              createdAt: new Date(),
              createdBy: userId,
              isDeleted: false
            }))
        );
      }
    },
    update: {
      graphql: {
        mutation: updateWarehouse
      },
      async handler(ctx) {
        const {_id, data } = ctx.params;
        const userId = ctx?.meta?.user?._id;

        return await this.adapter.updateById(_id, {...data, modifiedAt: new Date(), modifiedBy: userId});
      }
    },
    delete: {
      graphql: {
        mutation: removeWarehouse
      },
      async handler(ctx) {
        const { _id } = ctx.params;
        const query = {};

        if (_id?.length) {
          query['$or'] = [];
          _id.map((id) => query['$or'].push({_id: this.adapter.stringToObjectID(id)}) );
          const warehouses = await this.adapter.find({ query });

          for await (const warehouse of warehouses) {
            await this.adapter.updateById(warehouse._id, { isDeleted: true });
          }

          return warehouses;
        }
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
        query: warehouse
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
        query: warehouses
      },
      cache: false,
      async handler(ctx) {
        const {page = 1, pageSize = 10000, userId} = ctx.params;
        const offset = pageSize * (page - 1);
        const query = { isDeleted: false, userId };
        const items = [];

        const filter = {
          limit: pageSize,
          offset,
          query,
          sort: { 'createdAt': -1 }
        }
        const result = await this.adapter.find(filter);
        items.push(...result);

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
    getWarehouses: {
      params: {
        userId: schema.userId
      },
      cache: false,
      async handler(ctx) {
        const {userId} = ctx.params;
        const query = { isDeleted: false, createdBy: userId };

        return await this.adapter.find({ query, sort: { 'createdAt': -1 } });
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
