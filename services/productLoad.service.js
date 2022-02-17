'use strict';
const DbMixin = require('../mixins/db.mixin');
const AuthMixin = require('../mixins/auth.mixin');

const {
  ProductLoad,
  ProductLoadList
} = require('../graphql/types/products');

const {
  productLoads,
  productLoad
} = require('../graphql/queries/products');

const {
  createProductLoad,
  updateProductLoad,
  removeProductLoad
} = require('../graphql/mutations/products');

const {schema, fields} = require('../models/products/productType.model')
const _ = require("lodash");
const mongoose = require("mongoose");

module.exports = {
  name: 'productLoads',

  /**
   * Mixins
   */
  mixins: [DbMixin('productLoads'), AuthMixin],

  /**
   * Settings
   */
  settings: {
    entityName: 'productLoad',
    // Available fields in the responses
    fields: fields,
    // Validator for the `create` & `insert` actions.
    entityValidator: schema,
    entityRevisions: true,
    graphql: {
      type: [ProductLoad, ProductLoadList],
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
        mutation: createProductLoad
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
        mutation: updateProductLoad
      },
      async handler(ctx) {
        const {_id, ...restData} = ctx.params;
        const userId = ctx?.meta?.user?._id;
        return await this.adapter.updateById(_id, {...restData, modifiedAt: new Date(), modifiedBy: userId});
      }
    },
    delete: {
      graphql: {
        mutation: removeProductLoad
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
        query: productLoad
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
        query: productLoads
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
          name: '400',
          value: '1',
          index: 4,
          highlight: false,
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '500',
          value: '2',
          index: 5,
          highlight: false,
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '600',
          value: '3',
          index: 3,
          highlight: true,
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '700',
          value: '4',
          index: 6,
          highlight: false,
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '800',
          value: '5',
          index: 7,
          highlight: false,
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '900',
          value: '6',
          index: 8,
          highlight: false,
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '1000',
          value: '7',
          index: 9,
          highlight: false,
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '1200',
          value: '8',
          index: 2,
          highlight: true,
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '1300',
          value: '9',
          index: 10,
          highlight: false,
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '1400',
          value: '10',
          index: 11,
          highlight: false,
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '1500',
          value: '11',
          index: 12,
          highlight: false,
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '1600',
          value: '11',
          index: 12,
          highlight: false,
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '1700',
          value: '12',
          index: 13,
          highlight: false,
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '1800',
          value: '13',
          index: 14,
          highlight: false,
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '1900',
          value: '14',
          index: 15,
          highlight: false,
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '2000',
          value: '15',
          index: 1,
          highlight: true,
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '2100',
          value: '16',
          index: 16,
          highlight: false,
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '2200',
          value: '17',
          index: 17,
          highlight: false,
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '2300',
          value: '18',
          index: 18,
          highlight: false,
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '2400',
          value: '19',
          index: 19,
          highlight: false,
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '2500',
          value: '20',
          index: 20,
          highlight: false,
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
    await this.adapter.collection.createIndex(
      {index: 1},
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
