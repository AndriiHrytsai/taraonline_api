'use strict';
const DbMixin = require('../mixins/db.mixin');
const AuthMixin = require('../mixins/auth.mixin');

const {
  ProductCustomer,
  ProductCustomerList
} = require('../graphql/types/products');

const {
  productCustomers,
  productCustomer
} = require('../graphql/queries/products');

const {
  createProductCustomer,
  updateProductCustomer, removeProductCustomer
} = require('../graphql/mutations/products');

const {schema, fields} = require('../models/products/productType.model')
const _ = require("lodash");
const {productCustomerCreated, productCustomerUpdated} = require("../graphql/subscriptions/products");

module.exports = {
  name: 'productCustomers',

  /**
   * Mixins
   */
  mixins: [DbMixin('productCustomers'), AuthMixin],

  /**
   * Settings
   */
  settings: {
    entityName: 'productCustomers',
    // Available fields in the responses
    fields: fields,
    // Validator for the `create` & `insert` actions.
    entityValidator: schema,
    entityRevisions: true,
    graphql: {
      type: [ProductCustomer, ProductCustomerList],
      resolvers: {
        ProductCustomer: {
          productId: {
            action: 'products.read',
            rootParams: {
              productId: '_id'
            }
          },
          ownerId: {
            action: 'auth.read',
            rootParams: {
              ownerId: '_id'
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
          assets: {
            action: 'assets.getAsset',
            rootParams: {
              _id: 'itemId'
            }
          }
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
        mutation: createProductCustomer
      },
      async handler(ctx) {
        const {
          data: {message, ...restData}
        } = ctx.params;
        const userId = ctx?.meta?.user?._id;
        let customer = null;

        if (restData?.customerId !== restData?.ownerId) {
          customer = await this.adapter.insert({
            ...restData,
            createdAt: new Date(),
            createdBy: userId,
            isFinished: false,
            isApproved: false,
            isOwnerTransport: false,
            isDeleted: false
          });
          const product = await ctx.call('products.read', {_id: restData.productId});
          const conversation = await ctx.call('conversations.create', {
            data: {
              members: [restData.customerId, restData.ownerId],
              name: product?.title,
              productCustomerId: customer._id,
              type: 'private',
              productId: restData.productId
            }
          });

          await this.adapter.updateById(customer._id, {conversationId: conversation._id});
          customer.conversationId = conversation._id;

          if (message) {
            await ctx.call('messages.create', {
              data: {
                conversationId: conversation._id,
                userId,
                message
              }
            });
          }
        }

        return customer;
      }
    },
    update: {
      graphql: {
        mutation: updateProductCustomer
      },
      cache: false,
      async handler(ctx) {
        const { _id, data } = ctx.params;
        const userId = ctx?.meta?.user?._id;

        return await this.adapter.updateById(
            _id,
            {
              ...data,
              updatedAt: new Date(),
              updatedBy: userId
            }
        );
      }
    },
    read: {
      cache: {
        keys: ["_id"],
      },
      params: {
        _id: schema._id,
      },
      async handler(ctx) {
        const {_id} = ctx.params;
        let result = _.cloneDeep(
          await this.adapter.findById(_id)
        );

        if (result) {
          return result;
        }
      }
    },
    findByUsers: {
      graphql: {
        query: productCustomer
      },
      async handler(ctx) {
        const {_id, ownerId, customerId, productId} = ctx.params;
        const query = {
          '$or': [
              { ownerId: ownerId, customerId: customerId, productId },
              { ownerId: customerId, customerId: ownerId, productId }
            ],
          isDeleted: false
        };

        if (_id) {
          query['_id'] = _id;
        }

        return await this.adapter.findOne(query);
      }
    },
    list: {
      graphql: {
        query: productCustomers
      },
      cache: false,
      async handler(ctx) {
        const {
          page = 1,
          pageSize = 20,
          ownerId,
          customerId,
          productId,
          sort,
          createdAt,
          updatedAt,
          city,
          count,
          price,
          isFinished,
          isApproved,
          isOwnerTransport,
          isDeleted,
          ownerAndCustomer = null,
          orderStatus,
          ownerIds,
          customerIds
        } = ctx.params;

        const offset = pageSize * (page - 1);

        const query = { $or: [], isDeleted: false };
        const items = [];
        const sortField = {};

        if (isOwnerTransport !== null && isOwnerTransport !== undefined) {
          query['isOwnerTransport'] = isOwnerTransport;
        }

        if (isApproved !== null && isApproved !== undefined) {
          if (!isApproved && isFinished === false) {
            if (orderStatus !== null && orderStatus !== undefined) {
                query['isApproved'] = false
              if (orderStatus) {
                query['isFinished'] = false
              } else {
                query['isFinished'] = true
              }
            } else {
              query['$or'].push({ isApproved: { $not: { $exists: true } } });
              query['$or'].push({ isFinished: { $not: { $exists: true } } });
              delete query['isFinished']
            }
          } else {
            query['isApproved'] = isApproved;
          }
        }

        if (isDeleted !== null && isDeleted !== undefined) {
          query['isDeleted'] = isDeleted;
        }

        if (ownerAndCustomer) {
          const or = []
          if (isFinished === false && isApproved === false) {
            or.push({ isApproved: { $ne: true } })
            or.push({ isFinished: { $ne: true } })
          } else {
            if (isFinished !== null && isFinished !== undefined) {
              or.push({ isFinished })
            }
            if (isApproved !== null && isApproved !== undefined) {
              or.push({ isApproved })
            }
          }
          if (ownerIds || customerIds) {
            if (ownerIds) {
              ownerIds?.map((id) => query['$or'].push({ ownerId: id, $or: or }) );
            }
            if (customerIds) {
              customerIds.map((id) => query['$or'].push({ customerId: id, $or: or }) );
            }
          } else {
            query['$or'].push({ ownerId: ownerAndCustomer, $or: or });
            query['$or'].push({ customerId: ownerAndCustomer, $or: or });
          }
        } else {
          if (isFinished !== null && isFinished !== undefined) {
            query['isFinished'] = isFinished;
          }
          if (isApproved !== null && isApproved !== undefined) {
            query['isApproved'] = isApproved;
          }
          if (ownerIds || customerIds) {
            if (ownerIds) {
              ownerIds?.map((id) =>
                  query['$or'].push({ ownerId: id })
              );
            }
            if (customerIds) {
              customerIds?.map((id) =>
                  query['$or'].push({ customerId: id })
              )
            }
          } else {
            if (ownerId) {
              query['ownerId'] = ownerId;
            }
            if (customerId) {
              query['customerId'] = customerId;
            }
          }
        }

        if (productId) {
          query['productId'] = productId;
        }

        if (count) {
          query['count'] = count;
        }

        if (price) {
          query['price'] = price;
        }

        if (city) {
            query['city.placeId'] = city;
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

        if (sort?.field && sort?.value) {
          if (sort?.field === 'owner') {
            sortField['ownerId'] = Number(sort.value);
          } else if (sort?.field === 'customer') {
            sortField['customerId'] = Number(sort.value);
          } else {
            sortField[sort.field] = Number(sort.value);
          }
        } else {
          sortField['updatedAt'] = -1;
        }

        if (!query['$or']?.length) {
          delete query['$or'];
        }
        if (!query['$and']?.length) {
          delete query['$and'];
        }

        const filter = {
          limit: pageSize,
          offset,
          query,
          sort: sortField,
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
    },
    delete: {
      graphql: {
        mutation: removeProductCustomer
      },
      async handler(ctx) {
        const previous = this.adapter.findById(ctx.params._id);

        return await this.adapter.updateById(ctx.params._id, {isDeleted: true});
      }
    },
    deleteNotFinishedCustomers: {
      params: {
        productId: schema._id
      },
      async handler(ctx) {
        const or = []

        or.push({ isApproved: { $ne: true } })
        or.push({ isFinished: { $ne: true } })

        await this.adapter.updateMany({ $or: or }, { isDeleted: true, updatedAt: new Date() });
        return true;
      }
    },
    createSub: {
      graphql: {
        subscription: productCustomerCreated,
        tags: ['productCustomerCreated']
      },
      async handler(ctx) {
        return ctx.params.payload;
      }
    },
    updateSub: {
      graphql: {
        subscription: productCustomerUpdated,
        tags: ['productCustomerUpdated'],
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
    before: {
      /**
       * Register a before hook for the `create` action.
       * It sets a default value for the count field.
       *
       * @param {Context} ctx
       */
      async create(ctx) {
        this.addCreateParams(ctx);
      }
    },
    after: {
      async create(ctx, res) {
        await ctx.broadcast('graphql.publish', {
          tag: 'productCustomerCreated',
          payload: res
        });
        return res;
      },
      async update(ctx, res) {
        await ctx.broadcast("graphql.publish", {
          tag: 'productCustomerUpdated',
          payload: res,
        });
        return res;
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
