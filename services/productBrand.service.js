'use strict';
const DbMixin = require('../mixins/db.mixin');
const AuthMixin = require('../mixins/auth.mixin');

const {
  ProductBrand,
  ProductBrandList
} = require('../graphql/types/products');

const {
  productBrands,
  productBrand
} = require('../graphql/queries/products');

const {
  createProductBrand,
  updateProductBrand,
  removeProductBrand
} = require('../graphql/mutations/products');

const {schema, fields} = require('../models/products/productPalletType.model')
const _ = require("lodash");

module.exports = {
  name: 'productBrands',

  /**
   * Mixins
   */
  mixins: [DbMixin('productBrands'), AuthMixin],

  /**
   * Settings
   */
  settings: {
    entityName: 'productBrand',
    // Available fields in the responses
    fields: fields,
    // Validator for the `create` & `insert` actions.
    entityValidator: schema,
    entityRevisions: true,
    graphql: {
      type: [ProductBrand, ProductBrandList],
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
        mutation: createProductBrand
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
        mutation: updateProductBrand
      },
      async handler(ctx) {
        const {_id, name, value} = ctx.params;
        const userId = ctx?.meta?.user?._id;
        const updateItem = {};

        if (name) {
          updateItem['name'] = name;
        }

        if (value) {
          updateItem['value'] = value;
        }

        return await this.adapter.updateById(_id, {...updateItem, modifiedAt: new Date(), modifiedBy: userId});
      }
    },
    delete: {
      graphql: {
        mutation: removeProductBrand
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
        query: productBrand
      },
      async handler(ctx) {
        let arrayIds = ctx.params._id;

        if (arrayIds && arrayIds.length > 0) {
          let result = _.cloneDeep(
            await this.adapter.findByIds(arrayIds || [])
          );

          if (result) {
            delete result.isDeleted;
            return result;
          }
        }
        
        return null
      }
    },
    list: {
      graphql: {
        query: productBrands
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
          name: 'EUR',
          value: '1',
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: 'IPPC',
          value: '2',
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: 'FIN',
          value: '3',
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
