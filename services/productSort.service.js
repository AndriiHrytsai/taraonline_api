'use strict';
const DbMixin = require('../mixins/db.mixin');
const AuthMixin = require('../mixins/auth.mixin');

const {
  ProductSort,
  ProductSortList
} = require('../graphql/types/products');

const {
  productSorts,
  productSort
} = require('../graphql/queries/products');

const {
  createProductSort,
  updateProductSort,
  removeProductSort
} = require('../graphql/mutations/products');

const {schema, fields} = require('../models/products/productType.model')
const _ = require("lodash");
const mongoose = require("mongoose");

module.exports = {
  name: 'productSorts',

  /**
   * Mixins
   */
  mixins: [DbMixin('productSorts'), AuthMixin],

  /**
   * Settings
   */
  settings: {
    entityName: 'productSort',
    // Available fields in the responses
    fields: fields,
    // Validator for the `create` & `insert` actions.
    entityValidator: schema,
    entityRevisions: true,
    graphql: {
      type: [ProductSort, ProductSortList],
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
        mutation: createProductSort
      },
      async handler(ctx) {
        const data = ctx.params;
        const userId = ctx?.meta?.user?._id;
        return await this.adapter.insert({
          ...data,
          createdAt: new Date(),
          createdBy: userId,
          isDeleted: false
        });
      }
    },
    update: {
      graphql: {
        mutation: updateProductSort
      },
      async handler(ctx) {
        const {_id, ...restData} = ctx.params;
        const userId = ctx?.meta?.user?._id;
        return await this.adapter.updateById(_id, {...restData, modifiedAt: new Date(), modifiedBy: userId});
      }
    },
    delete: {
      graphql: {
        mutation: removeProductSort
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
        query: productSort
      },
      async handler(ctx) {
        let _id = ctx.params._id;

        let result = _.cloneDeep(
          await this.adapter.findById(_id)
        );

        if (result) {
          delete result.isDeleted;
          return result;
        }
      }
    },
    readByIdAndValue: {
      cache: {
        keys: ["_id"]
      },
      params: {
        _id: schema._id
      },
      async handler(ctx) {
        let _id = ctx.params._id;
        let result;
        let query = {isDeleted: false};
        if (_.isArray(_id) && _id?.length) {
          query['$or'] = [];
          _id.map((id) => {
              query['$or'].push({_id: id});
              query['$or'].push({value: id});
            }
          );
        } else if (_id?.length) {
          query['$or'] = [];
          query['$or'].push({_id: mongoose.Types.ObjectId(_id)});
          query['$or'].push({value: _id});
        }
        result = _.cloneDeep(
          await this.adapter.find({query})
        );

        if (result) {
          delete result.isDeleted;
          return result;
        }
      }
    },
    list: {
      graphql: {
        query: productSorts
      },
      cache: false,
      async handler(ctx) {
        const {page = 1, pageSize = 20} = ctx.params;
        const offset = pageSize * (page - 1);
        const query = {isDeleted: false};
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
      const DATE = new Date();
      await this.adapter.insertMany([
        {
          name: 'Higher',
          value: '1',
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '1',
          value: '2',
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '2',
          value: '3',
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '3',
          value: '4',
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '4',
          value: '5',
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        }
      ]);
    }
  },

  /**
   * Fired after database connection establishing.
   */
  async afterConnected() {
    /**
     * Create necessary indexes
     */
    await this.adapter.collection.createIndex(
      {name: 1},
      {unique: true}
    );
    await this.adapter.collection.createIndex(
      {value: 1},
      {unique: true}
    );
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
