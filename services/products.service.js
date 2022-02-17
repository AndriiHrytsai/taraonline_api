'use strict';

const DbMixin = require('../mixins/db.mixin');
const AuthMixin = require('../mixins/auth.mixin');
const {Product, ProductList, ProductOptionsList} = require('../graphql/types/products');
const {products, product, productOptions, allActivatedList} = require('../graphql/queries/products');
const {createProduct, updateProduct, removeProduct, activateProduct, deactivateProduct} = require('../graphql/mutations/products');
const {schema, fields} = require('../models/products/product.model');
const {productUpdated, productCreated, productDeleted} = require("../graphql/subscriptions/products");
const _ = require("lodash");

/**
 * @typedef {import("moleculer").Context} Context Moleculer's Context
 */

module.exports = {
  name: 'products',

  /**
   * Mixins
   */
  mixins: [DbMixin('products'), AuthMixin],

  /**
   * Settings
   */
  settings: {
    entityName: 'products',
    // Available fields in the responses
    fields: fields,
    // Validator for the `create` & `insert` actions.
    entityValidator: schema,
    entityRevisions: true,
    graphql: {
      type: [Product, ProductList, ProductOptionsList],
      resolvers: {
        Product: {
          userId: {
            action: 'auth.read',
            rootParams: {
              userId: '_id'
            }
          },
          productStatus: {
            action: 'productStatuses.read',
            rootParams: {
              productStatus: '_id'
            }
          },
          conversationId: {
            action: 'conversations.readByItemId',
            rootParams: {
                userId: 'ownerId',
                _id: 'productId'
            }
          },
          productType: {
            action: 'productTypes.read',
            rootParams: {
              productType: '_id'
            }
          },
          paymentType: {
            action: 'paymentTypes.read',
            rootParams: {
              paymentType: '_id'
            }
          },
          productPalletType: {
            action: 'productPalletTypes.read',
            rootParams: {
              productPalletType: '_id'
            }
          },
          productBrands: {
            action: 'productBrands.read',
            rootParams: {
              productBrands: '_id'
            }
          },
          productSize: {
            action: 'productSizes.read',
            rootParams: {
              productSize: '_id'
            }
          },
          productLoad: {
            action: 'productLoads.read',
            rootParams: {
              productLoad: '_id'
            }
          },
          productSort: {
            action: 'productSorts.read',
            rootParams: {
              productSort: '_id'
            }
          },
          assets: {
            action: 'assets.getAsset',
            rootParams: {
              _id: 'itemId'
            }
          }
        },
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
        mutation: createProduct,
      },
      async handler(ctx) {
        const data = ctx.params.data;

        return await this.adapter.insert({
          ...data,
          createdAt: new Date(),
          createdBy: data?.userId,
          updatedAt: new Date(),
          updatedBy: data?.userId,
          isDeleted: false,
          isActivated: true
        });
      }
    },
    read: {
      graphql: {
        query: product,
      },
      cache: false,
      async handler(ctx) {
        let {_id: productId} = ctx?.params;
        const userId = ctx?.meta?.user?._id;
        if (ctx?.params?.payload?._id) {
          productId = ctx?.params?.payload?._id;
        }
        const product = await this.adapter.findById(productId);
        if (product) {
          product.canVote = await ctx.call('rankings.canVote', {
            userId,
            itemId: productId,
            ownerId: product.userId,
          });
        }
        return product;
      }
    },
    update: {
      graphql: {
        mutation: updateProduct
      },
      cache: false,
      async handler(ctx) {
        const {
          _id,
          removeAssetList,
          data
        } = ctx.params;

        if (removeAssetList?.length) {
          await ctx.call('assets.removeAssetList', {listId: removeAssetList});
        }
        return await this.adapter.updateById(
          _id,
          {
            ...data,
            updatedAt: new Date(),
            updatedBy: data?.userId
          }
        );
      }
    },
    deactivate: {
      graphql: {
        mutation: deactivateProduct
      },
      async handler(ctx) {
        const product = await this.adapter.updateById(ctx.params._id, { isActivated: false });

        await ctx.broadcast("graphql.publish", {
          tag: 'productUpdated',
          payload: product,
        });
        return product;
      }
    },
    activate: {
      graphql: {
        mutation: activateProduct
      },
      async handler(ctx) {
        const product = await this.adapter.updateById(ctx.params._id, {updatedAt: new Date(), isActivated: true});

        await ctx.broadcast("graphql.publish", {
          tag: 'productUpdated',
          payload: product,
        });

        return product;
      }
    },
    delete: {
      graphql: {
        mutation: removeProduct
      },
      async handler(ctx) {
        const previous = this.adapter.findById(ctx.params._id);

        await this.adapter.updateById(ctx.params._id, {isDeleted: true});
        return previous;
      }
    },
    listOptions: {
      graphql: {
        query: productOptions
      },
      cache: false,
      async handler(ctx) {
        const productSorts = await ctx.call('productSorts.list', ctx.params);
        const productTypes = await ctx.call('productTypes.list', ctx.params);
        const productLoads = await ctx.call('productLoads.list', ctx.params);
        const productSizes = await ctx.call('productSizes.list', ctx.params);
        const paymentTypes = await ctx.call('paymentTypes.list', ctx.params);
        const productPalletTypes = await ctx.call('productPalletTypes.list', ctx.params);
        const productBrands = await ctx.call('productBrands.list', ctx.params);
        return {
          productSorts,
          productTypes,
          productLoads,
          productSizes,
          paymentTypes,
          productPalletTypes,
          productBrands,
        };
      }
    },
    list: {
      graphql: {
        query: products,
      },
      cache: false,
      async handler(ctx) {
        const {
          page = 1,
          pageSize = 20,
          userId,
          userIds,
          city,
          username,
          minCount,
          maxCount,
          createdAt,
          updatedAt,
          isTax,
          isBuy,
          isCertificate,
          isActivate,
          price,
          sort,
          title,
          customSize,
          customSort,
          customLoad,
          customPalletType,
          productTypes,
          productLoads,
          productSorts,
          productSizes,
          productPalletTypes,
          productBrands,
          paymentType
        } = ctx.params;

        const ctxUserId = ctx.meta.user._id;

        const offset = pageSize * (page - 1);

        const query = {$or: [], isDeleted: false};
        const sortField = {};
        let items = [];

        if (userIds) {
          userIds.map((id) =>
              query['$or'].push({ userId: id })
          );
        } else if (userId) {
          query['userId'] = userId;
        } else {
          //query['userId'] = {$ne: ctxUserId};
          query['isActivated'] = true;
        }

        if (isActivate !== null && isActivate !== undefined) {
          query['isActivated'] = isActivate;
        }

        if (minCount !== null && minCount !== undefined) {
          query['minCount'] = {$gte: minCount};
        }

        if (paymentType !== null && paymentType !== undefined) {
          query['paymentType'] = paymentType;
        }

        if (maxCount !== null && maxCount !== undefined) {
          query['maxCount'] = {$lte: maxCount};
        }

        if (productBrands !== null && productBrands !== undefined && productBrands.length) {
          query['productBrands'] = {$in: productBrands};
        }

        if (isTax !== null && isTax !== undefined) {
          query['isTax'] = isTax;
        }
        if (isBuy !== null && isBuy !== undefined) {
          query['isBuy'] = isBuy;
        }

        if (isCertificate !== null && isCertificate !== undefined) {
          query['isCertificate'] = isCertificate;
        }

        if (city) {
          query['city.placeId'] = city;
        }

        if (title) {
          query['title'] = {
            $regex: '.*' + title + '.*',
            $options: 'i'
          }
        }

        if (customSize && productSizes?.length) {
          query['$or'].push({customSize: {'$exists': true}});
        } else if (customSize && !productSizes?.length) {
          query['customSize'] = {'$exists': true};
        }

        if (customPalletType && productPalletTypes?.length) {
          query['$or'].push({customPalletType: {'$exists': true}});
        } else if (customPalletType && !productPalletTypes?.length) {
          query['customPalletType'] = {'$exists': true};
        }

        if (customSort && productSorts?.length) {
          query['$or'].push({customSort: {'$exists': true}});
        } else if (customSort && !productSorts?.length) {
          query['customSort'] = {'$exists': true};
        }

        if (customLoad && productLoads?.length) {
          query['$or'].push({customLoad: {'$exists': true}});
        } else if (customLoad && !productLoads?.length) {
          query['customLoad'] = {'$exists': true};
        }

        if (username) {
          const users = await ctx.call('auth.findByQuery', {
            query: {
              username: {
                $regex: '.*' + username + '.*',
                $options: 'i'
              }
            },
            limit: pageSize
          });

          const ids = users.map((user) => user._id);

          if (ids?.length > 1) {
            ids.map((id) =>
              query['$or'].push({userId: id})
            );
          } else if (ids?.length) {
            query['userId'] = ids[0];
          }
        }

        if (updatedAt?.from && updatedAt?.to) {
          query['$and'] = [{
            updatedAt: {
              $gte: new Date(updatedAt.from)
            }
          },
            {
              updatedAt: {
                $lte: new Date(updatedAt.to)
              }
            }];
        } else if (updatedAt?.from && !updatedAt?.to) {
          query['updatedAt'] = {$gte: new Date(updatedAt.from)};
        } else if (!updatedAt?.from && updatedAt?.to) {
          query['updatedAt'] = {$lte: new Date(updatedAt.to)};
        }

        if (createdAt?.from && createdAt?.to) {
          query['$and'] = [{
            createdAt: {
              $gte: new Date(createdAt.from)
            }
          },
            {
              createdAt: {
                $lte: new Date(createdAt.to)
              }
            }];
        } else if (createdAt?.from && !createdAt?.to) {
          query['createdAt'] = {$gte: new Date(createdAt.from)};
        } else if (!createdAt?.from && createdAt?.to) {
          query['createdAt'] = {$lte: new Date(createdAt.to)};
        }

        if (price?.from !== null && price?.to !== null && price?.from !== undefined && price?.to !== undefined) {
          query['$and'] = [{
            price: {
              $gte: price.from
            }
          },
            {
              price: {
                $lte: price.to
              }
            }];
        } else if (price?.from !== null && price?.from !== undefined && !price?.to) {
          query['price'] = {$gte: price.from};
        } else if (!price?.from && price?.to !== null && price?.to !== undefined) {
          query['price'] = {$lte: price.to};
        }

        if (productTypes?.length > 1) {
          productTypes.map((productType) =>
            query['$or'].push({productType: productType})
          );
        } else if (productTypes?.length) {
          query['productType'] = productTypes[0];
        }

        if (productLoads?.length > 1) {
          productLoads.map((productLoad) =>
            query['$or'].push({productLoads: productLoad})
          );
        } else if (productLoads?.length && customLoad) {
          query['$or'].push({productLoad: productLoads[0]})
        } else if (productLoads?.length && !customLoad) {
          query['productLoad'] = productLoads[0];
        }

        if (productSorts?.length > 1) {
          productSorts.map((productSort) =>
            query['$or'].push({productSort: productSort})
          );
        } else if (productSorts?.length && customSort) {
          query['$or'].push({productSort: productSorts[0]})
        } else if (productSorts?.length && !customSort) {
          query['productSort'] = productSorts[0];
        }

        if (productSizes?.length > 1) {
          productSizes.map((productSize) =>
            query['$or'].push({productSize})
          );
        } else if (productSizes?.length && customSize) {
          query['$or'].push({productSize: productSizes[0]})
        } else if (productSizes?.length && !customSize) {
          query['productSize'] = productSizes[0];
        }

        if (productPalletTypes?.length > 1) {
          productPalletTypes.map((productPalletType) =>
            query['$or'].push({productPalletType})
          );
        } else if (productPalletTypes?.length && customPalletType) {
          query['$or'].push({productPalletType: productPalletTypes[0]})
        } else if (productPalletTypes?.length && !customPalletType) {
          query['productPalletType'] = productPalletTypes[0];
        }

        if (!query['$or']?.length) {
          delete query['$or'];
        }

        if (sort?.field && sort?.value) {
          if (sort?.field === 'title') {
            sortField['userId'] = Number(sort.value);
          } else if (sort?.field === 'productSort') {
            sortField['productSort'] = Number(sort.value);
            sortField['customSort'] = Number(sort.value);
          } else if (sort?.field === 'productSize') {
            sortField['productSize'] = Number(sort.value);
            sortField['customSize'] = Number(sort.value);
          } else if (sort?.field === 'productLoad') {
            sortField['productLoad'] = Number(sort.value);
            sortField['customLoad'] = Number(sort.value);
          } else if (sort?.field === 'productPalletType') {
            sortField['productPalletType'] = Number(sort.value);
            sortField['customPalletType'] = Number(sort.value);
          } else {
            sortField[sort.field] = Number(sort.value);
          }
        } else {
          sortField['updatedAt'] = -1;
        }

        if (!query['$or']?.length) {
          delete query['$or'];
        }

        const filter = {
          limit: pageSize,
          offset,
          query,
          sort: sortField,
        };

        items = await this.adapter.find(filter);
        const total = await this.adapter.count({ query });

        const totalPages = Math.ceil(total / pageSize);

        return {
          rows: items,
          page,
          pageSize,
          total,
          totalPages
        };
      }
    },
    getCounts: {
      params: {
        userId: schema.userId
      },
      async handler(ctx) {
        let userId = ctx.params.userId;

        const actProducts = await ctx.call('products.list', {pageSize:10000, userId, isActivate:true});
        const deactProducts = await ctx.call('products.list', {pageSize:10000, userId, isActivate:false});
        const productCustomers = await ctx.call('productCustomers.list', {pageSize:10000, customerId: userId});

        // const activatedProducts = await this.adapter.count({ query: { userId, isActivate:true } });
        // const deactivatedProducts = await this.adapter.count({ query: { userId, isActivate:false } });
        //
        // console.log('userId', activatedProducts, deactivatedProducts)

        return {
          activatedProducts: actProducts?.rows?.length || 0,
          deactivatedProducts: deactProducts?.rows?.length || 0,
          customerProducts: productCustomers?.rows?.length || 0
        }
      }
    },
    allActivatedList: {
      params: {
        _id: schema._id
      },
      async handler() {
        const query = {
          isActivated: true
        };

        const filter = {
          query
        };
        return await this.adapter.find(filter);
      }
    },
    allUsersWithActivated: {
      graphql: {
        query: allActivatedList,
      },
      async handler(ctx) {
        const {
          isActivated,
          page = 1,
          pageSize = 10000
        } = ctx.params;
        const query = {};

        if (isActivated !== null && isActivated !== undefined) {
          query['isActivated'] = isActivated;
        }

        const filter = {
          query
        };

        const items = await this.adapter.find(filter);

        const uniqItems = _.unionBy(items, 'userId');

        return {
          rows: uniqItems,
          page,
          pageSize,
          total: uniqItems.length,
          totalPages: 0
        }
      }
    },
    createSub: {
      graphql: {
        subscription: productCreated,
        tags: ['productCreated']
      },
      async handler(ctx) {
        return ctx.params.payload;
      }
    },
    updateSub: {
      graphql: {
        subscription: productUpdated,
        tags: ['productUpdated'],
      },
      async handler(ctx) {
        return ctx.params.payload;
      }
    },
    deleteSub: {
      graphql: {
        subscription: productDeleted,
        tags: ['productDeleted']
      },
      async handler(ctx) {
        return ctx.params.payload;
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
          tag: 'productCreated',
          payload: res
        });
        return res;
      },
      async update(ctx, res) {
        await ctx.broadcast("graphql.publish", {
          tag: 'productUpdated',
          payload: res,
        });
        return res;
      },
      async delete(ctx, res) {
        await ctx.broadcast('graphql.publish', {
          tag: 'productDeleted',
          payload: res,
        });
        return res;
      }
    }
  },

  /**
   * Events
   */
  events: {
  },

  /**
   * Methods
   */
  methods: {
  },

  async afterConnected() {
    this.logger.info('Products service connected successfully');
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

