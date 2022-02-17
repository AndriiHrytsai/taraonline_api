'use strict';
const DbMixin = require('../mixins/db.mixin');
const AuthMixin = require('../mixins/auth.mixin');

const {
  ProductSize,
  ProductSizeList
} = require('../graphql/types/products');

const {
  productSizes,
  productSize
} = require('../graphql/queries/products');

const {
  createProductSize,
  updateProductSize,
  removeProductSize
} = require('../graphql/mutations/products');

const {schema, fields} = require('../models/products/productSize.model')
const _ = require("lodash");
const mongoose = require("mongoose");

module.exports = {
  name: 'productSizes',

  /**
   * Mixins
   */
  mixins: [DbMixin('productSizes'), AuthMixin],

  /**
   * Settings
   */
  settings: {
    entityName: 'productSize',
    // Available fields in the responses
    fields: fields,
    // Validator for the `create` & `insert` actions.
    entityValidator: schema,
    entityRevisions: true,
    graphql: {
      type: [ProductSize, ProductSizeList],
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
        mutation: createProductSize
      },
      async handler(ctx) {
        const {name, value} = ctx.params;
        const userId = ctx?.meta?.user?._id;
        return await this.adapter.insert({
          name,
          value,
          createdAt: new Date(),
          createdBy: userId,
          isDeleted: false
        });
      }
    },
    update: {
      graphql: {
        mutation: updateProductSize
      },
      async handler(ctx) {
        const {_id, ...restData} = ctx.params;
        const userId = ctx?.meta?.user?._id;
        return await this.adapter.updateById(_id, {...restData, modifiedAt: new Date(), modifiedBy: userId});
      }
    },
    delete: {
      graphql: {
        mutation: removeProductSize
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
        query: productSize
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
        query: productSizes
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
          name: '800 х 1200',
          value: '1',
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '1000 х 1200',
          value: '2',
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '1200 х 1200',
          value: '3',
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '1150 х 1150',
          value: '4',
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '1100 х 1300',
          value: '5',
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '1000 х 1000',
          value: '6',
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '960 х 960',
          value: '7',
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '900 х 1200',
          value: '8',
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '800 х 1000',
          value: '9',
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '600 х 800',
          value: '10',
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '600 х 600',
          value: '11',
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '18 х 80 х 800',
          value: '12',
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '20 х 80 х 800',
          value: '13',
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '20 х 95 х 1200',
          value: '14',
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '22 х 98 х 1200',
          value: '15',
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '22 х 143 х 1200',
          value: '16',
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '22 х 100 х 1200',
          value: '17',
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '22 х 120 х 1200',
          value: '18',
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '22 х 145 х 800',
          value: '19',
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '22 х 100 х 2400',
          value: '20',
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '22 х 140 х 1200',
          value: '21',
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '70 х 100 х 1200',
          value: '22',
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '78 х 143 х 1200',
          value: '23',
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '78 х 98 х 1200',
          value: '24',
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '100 x 100 x 78',
          value: '25',
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '100 х 145 х 78',
          value: '26',
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '145 х 145 х 78',
          value: '27',
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: '100 х 100 х 2000',
          value: '28',
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
