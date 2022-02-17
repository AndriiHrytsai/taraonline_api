'use strict';

const DbMixin = require('../mixins/db.mixin');
const AuthMixin = require('../mixins/auth.mixin');

const {
  BetaUser
} = require('../graphql/types/users');

const {
  betaUser
} = require('../graphql/queries/users');

const {
  createBetaUser,
  removeBetaUser,
  createManyBetaUser
} = require('../graphql/mutations/users');

const {schema, fields} = require('../models/users/beta-user.model');

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
  name: 'betaUsers',

  /**
   * Mixins
   */
  mixins: [DbMixin('betaUsers'), AuthMixin],

  /**
   * Settings
   */
  settings: {
    entityName: 'betaUsers',
    // Available fields in the responses
    fields: fields,
    // Validator for the `create` & `insert` actions.
    entityValidator: schema,
    entityRevisions: true,
    graphql: {
      type: [BetaUser]
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
      params: {
        email: schema.email
      },
      graphql: {
        mutation: createBetaUser
      }
    },
    createMany: {
      graphql: {
        mutation: createManyBetaUser
      },
      async handler(ctx) {
        const {emails} = ctx.params;

        return await this.adapter.insertMany(emails.map((email) => ({ email })));
      }
    },
    read: {
      params: {
        email: schema.email
      },
      graphql: {
        query: betaUser
      },
      cache: false,
      async handler(ctx) {
        const {email} = ctx.params;

        const filter = {
          query: {
            email
          }
        }

        const result = await this.adapter.find(filter)
        return result && result.length ? result[0] : null;
      }
    },
    removeBetaUser: {
      graphql: {
        mutation: removeBetaUser
      },
      params: {
        email: schema.email
      },
      async handler(ctx) {
        const {email} = ctx.params;

        const creatorEmail = ctx.meta && ctx.meta.user && ctx.meta.user.email ? ctx.meta.user.email : undefined;
        if (process.env.ADMIN_EMAIL !== creatorEmail) {
          throw new MoleculerClientError('User can\'t be removed from beta list', 403, 'INVALID_ADMIN');
        }

        await this.adapter.removeMany({'email': email});

        return true;
      }
    }
  },

  /**
   * Action Hooks
   */
  hooks: {},

  /**
   * Events
   */
  events: {},

  /**
   * Methods
   */
  methods: {
    async seedDB() {
      await this.adapter.insertMany([
        {
          email: 'misha.tret.ua@gmail.com',
        },
        {
          email: 'bogdan.senkiv@gmail.com',
        },
        {
          email: 'raf02041994@gmail.com',
        },
        {
          email: 'atretiak.work@gmail.com',
        },
        {
          email: 'petershevchuk@azon5.com',
        },
        {
          email: 'bank201008@gmail.com',
        },
        {
          email: '22usyk08@gmail.com',
        },
        {
          email: 'horyachka@gmail.com',
        }
      ]);
    },
  },

  async afterConnected() {
    this.logger.info('BetaUsers service connected successfully');
    /**
     * Create necessary indexes
     */
    await this.adapter.collection.createIndex(
      {email: 1},
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
