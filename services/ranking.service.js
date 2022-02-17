'use strict';

const {MoleculerClientError} = require('moleculer').Errors;
const DbMixin = require('../mixins/db.mixin');
const AuthMixin = require('../mixins/auth.mixin');

const {createRanking} = require('../graphql/mutations/ranking');
const {ranking} = require('../graphql/queries/ranking');
const {schema, fields} = require('../models/ranking/ranking.model');
const {Ranking} = require("../graphql/types/ranking");

module.exports = {
  name: 'rankings',

  mixins: [DbMixin('rankings'), AuthMixin],

  settings: {
    /**
     * Available fields in the responses
     */
    fields: fields,

    /**
     * Name of a singe entity
     */
    entityName: 'rankings',

    /**
     * Validator for the `create` & `insert` actions.
     */
    entityValidator: schema,

    /**
     * Create revision history
     */
    entityRevisions: true,

    /**
     * GraqhQL definitions
     */
    graphql: {
      type: [Ranking],
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
    canVote: {
      cache: false,
      async handler(ctx) {
        const {itemId, ownerId, userId} = ctx.params;
        const ranking = await this.adapter.findOne({userId: ownerId, itemId, votedUserId: userId});
        const productCustomer = await ctx.call('productCustomers.findByUsers', {
          ownerId,
          customerId: userId,
          productId: itemId
        });
        const deliveryCustomer = await ctx.call('deliveryCustomers.findByUsers', {
          ownerId,
          customerId: userId,
          deliveryId: itemId
        });

        if (ranking) {
          return false;
        } else return !!(productCustomer || deliveryCustomer);
      }
    },
    getRanking: {
      cache: false,
      params: {
        userId: schema.userId
      },
      graphql: {
        query: ranking
      },
      async handler(ctx) {
        const {userId} = ctx.params;
        const rankings = await this.adapter.find({query: {userId}});
        if (rankings?.length > 1) {
          const ratings = rankings.map((ranking) => ranking?.rating);
          return Math.round(ratings.reduce((a, b) => a + b, 0) / ratings?.length);
        } else if (rankings?.length === 1) {
          return rankings[0]?.rating ? rankings[0].rating : 0;
        } else {
          return 0;
        }
      }
    },
    create: {
      graphql: {
        mutation: createRanking
      },
      cache: false,
      async handler(ctx) {
        const {
          data: {userId, votedUserId, itemId, rating}
        } = ctx.params;

        const user = await ctx.call('auth.read', {_id: userId});
        const votedUser = await ctx.call('auth.read', {_id: votedUserId});
        const product = await ctx.call('products.read', {_id: itemId});
        const delivery = await ctx.call('deliveries.read', {_id: itemId});
        const productCustomer = await ctx.call('productCustomers.findByUsers', {
          ownerId: votedUserId,
          customerId: userId,
          productId: itemId
        });
        const deliveryCustomer = await ctx.call('deliveryCustomers.findByUsers', {
          ownerId: votedUserId,
          customerId: userId,
          deliveryId: itemId
        });
        const ranking = await this.adapter.findOne({userId, votedUserId, itemId});

        if (userId !== votedUserId) {
          if (user && votedUser) {
            if (product || delivery) {
              if (productCustomer || deliveryCustomer) {
                if (!ranking) {
                  return await this.adapter.insert({userId, votedUserId, itemId, rating, createdAt: new Date()});
                } else {
                  throw new MoleculerClientError('User cannot vote again!', 400);
                }
              } else {
                throw new MoleculerClientError('A user cannot rate another user without buying or selling anything!', 400);
              }
            } else {
              throw new MoleculerClientError('Product or Delivery not found!', 400);
            }
          } else {
            throw new MoleculerClientError('Users not found!', 400);
          }
        } else {
          throw new MoleculerClientError('The user cannot rate himself!', 400);
        }
      }
    },
  },

  /**
   * Hooks
   */
  hooks: {
    before: {},
    after: {}
  },

  /**
   * Events
   */
  events: {},

  /**
   * Methods
   */
  methods: {},

  /**
   * Fired after database connection establishing.
   */
  async afterConnected() {
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
