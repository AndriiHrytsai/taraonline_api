'use strict';
const DbMixin = require('../mixins/db.mixin');
const AuthMixin = require('../mixins/auth.mixin');

const {
  ProductType,
  ProductTypeList
} = require('../graphql/types/products');

const {
  productTypes,
  productType
} = require('../graphql/queries/products');

const {
  createProductType,
  updateProductType,
  removeProductType
} = require('../graphql/mutations/products');

const {schema, fields} = require('../models/products/productType.model')
const _ = require("lodash");

module.exports = {
  name: 'productTypes',

  /**
   * Mixins
   */
  mixins: [DbMixin('productTypes'), AuthMixin],

  /**
   * Settings
   */
  settings: {
    entityName: 'productType',
    // Available fields in the responses
    fields: fields,
    // Validator for the `create` & `insert` actions.
    entityValidator: schema,
    entityRevisions: true,
    graphql: {
      type: [ProductType, ProductTypeList],
      resolvers: {
        ProductType: {
          productSize: {
            action: 'productSizes.readByIdAndValue',
            rootParams: {
              productSize: '_id'
            }
          },
          productSort: {
            action: 'productSorts.readByIdAndValue',
            rootParams: {
              productSort: '_id'
            }
          },
          productLoad: {
            action: 'productLoads.readByIdAndValue',
            rootParams: {
              productLoad: '_id'
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
        mutation: createProductType
      },
      async handler(ctx) {
        const data = ctx.params.data;
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
        mutation: updateProductType
      },
      async handler(ctx) {
        const {_id, ...restData} = ctx.params.data;
        const userId = ctx?.meta?.user?._id;

        return await this.adapter.updateById(_id, {...restData, modifiedAt: new Date(), modifiedBy: userId});
      }
    },
    delete: {
      graphql: {
        mutation: removeProductType
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
        query: productType
      },
      async handler(ctx) {
        let _id = ctx.params._id;

        let result = _.cloneDeep(
          await this.adapter.findById(_id)
        );

        if (result) {
          delete result.isDeleted;
        }
        return result;
      }
    },
    list: {
      graphql: {
        query: productTypes
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
          name: 'Pallet',
          value: '1',
          isCustomSize: true,
          isCustomSort: false,
          isCustomLoad: false,
          isPalletType: true,
          isBrand: true,
          isCertificate: true,
          productSize: ['1', '2', '3', "4", "5", "6", "7", "8", "9", "10", "11"],
          productLoad: ['1', '2', '3', "4", "5", "6", "7", "8", "9", "10", "11", '12', '13', "14", "15", "16", "17", "18", "19", "20"],
          productSort: ['1', '2', '3'],
          isWidth: true,
          isLength: true,
          isHeight: false,
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: 'Pallet board',
          value: '2',
          isCustomSize: false,
          isCustomSort: false,
          isCustomLoad: false,
          isPalletType: false,
          isBrand: false,
          isCertificate: false,
          productSize: ['1', '2', '10'],
          productLoad: [],
          productSort: ['2', '3'],
          isWidth: false,
          isLength: false,
          isHeight: false,
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: 'Pallet checker',
          value: '3',
          isCustomSize: true,
          isCustomSort: false,
          isCustomLoad: false,
          isPalletType: false,
          isBrand: false,
          isCertificate: false,
          productSize: ['25', '26', '27'],
          productLoad: [],
          productSort: [],
          isWidth: true,
          isLength: true,
          isHeight: true,
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: 'Pallet table',
          value: '4',
          isCustomSize: true,
          isCustomSort: false,
          isCustomLoad: false,
          isPalletType: false,
          isBrand: false,
          isCertificate: false,
          productSize: ['12', '13', "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24"],
          productLoad: [],
          productSort: ['2', '3', '4', '5'],
          isWidth: true,
          isLength: true,
          isHeight: true,
          createdAt: DATE,
          createdBy: this.settings.systemAccountCode,
          isDeleted: false
        },
        {
          name: 'Pallet beam',
          value: '5',
          isCustomSize: true,
          isCustomSort: false,
          isCustomLoad: false,
          isPalletType: false,
          isBrand: false,
          isCertificate: false,
          productSize: ['28'],
          productLoad: [],
          productSort: ['2', '3', '4', '5'],
          isWidth: true,
          isLength: true,
          isHeight: true,
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
