'use strict';

require('dotenv').config();
const fs = require('fs');
const {mkdir} = fs;
const {MoleculerError} = require('moleculer').Errors;

const DbService = require('moleculer-db');

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = function (collection) {
  const cacheCleanEventName = `cache.clean.${collection}`;

  const schema = {
    mixins: [DbService],

    settings: {
      systemAccountCode: '0000000000'
    },

    actions: {
      list: {
        rest: null
      },
      create: {
        rest: null
      },
      get: {
        rest: null
      },
      update: {
        rest: null,
        async handler(ctx) {
          const params = ctx.params;

          const userId = ctx.meta.user ? ctx.meta.user._id : this.settings.systemAccountCode;
          params.modifiedAt = new Date();
          params.modifiedBy = userId;
          return this._update(ctx, params);
        }
      },
      delete: {
        rest: null,
        async handler(ctx) {
          const params = ctx.params;

          const userId = ctx.meta.user ? ctx.meta.user._id : this.settings.systemAccountCode;

          params.isDeleted = true;
          params.modifiedAt = new Date();
          params.modifiedBy = userId;
          return this._update(ctx, params);
        }
      },
      remove: {
        rest: null,
        async handler(ctx) {
          const params = ctx.params;
          return this.remove(ctx, params);
        }
      },
      removeMany: {
        rest: null,
        async handler(ctx) {
          const params = ctx.params;
          const result = await this.adapter.removeMany(query);
          return result;
        }
      }
    },
    events: {
      /**
       * Subscribe to the cache clean event. If it's triggered
       * clean the cache entries for this service.
       *
       * @param {Context} ctx
       */
      async [cacheCleanEventName]() {
        if (this.broker.cacher) {
          await this.broker.cacher.clean(`${this.fullName}.*`);
        }
      }
    },
    hooks: {},
    methods: {
      async findOneByCode(query) {
        query.isDeleted = false;

        const result = await this.adapter.findOne(query);

        if (result) {
          return result;
        }
        throw new MoleculerError(
          'Entity not found!',
          404,
          'ENTITY_NOT_FOUND'
        );
      },
      async findOne(query) {
        query.isDeleted = false;

        const result = await this.adapter.findOne(query);

        if (result) {
          return result;
        }
        throw new MoleculerError(
          // eslint-disable-next-line
          `Entity not found!`,
          404,
          'ENTITY_NOT_FOUND'
        );
      },

      /**
       * Send a cache clearing event when an entity changed.
       *
       * @param {String} type
       * @param {any} json
       * @param {Context} ctx
       */
      async entityChanged(type, json, ctx) {
        ctx.broadcast(cacheCleanEventName);
      },
      async getNextFreeCode(codeLength) {
        const recordWithLastCode = await this.actions.find({
          query: {},
          limit: 1,
          sort: '-code'
        });
        if (recordWithLastCode.length > 0) {
          const latestCodeString = recordWithLastCode[0].code;
          const codeAsInteger = parseInt(latestCodeString) + 1;
          return this.padWithZero(codeAsInteger, codeLength);
        } else {
          return '0001';
        }
      },
      padWithZero(number, length) {
        const zero = '0';
        number = number + '';
        return number.length >= length ?
          number :
          new Array(length - number.length + 1).join(zero) + number;
      },
      addCreateParams(ctx) {
        const userId = ctx?.params?.data?.userId ? ctx.params.data.userId : this.settings.systemAccountCode;
        ctx.params.data.createdAt = new Date();
        ctx.params.data.createdBy = userId;
        ctx.params.data.isDeleted = false;
      },
      addModifyParams(ctx) {
        const userId = ctx?.params?.data?.userId ? ctx.params.data.userId : this.settings.systemAccountCode;
        ctx.params.modifiedAt = new Date();
        ctx.params.modifiedBy = userId;
      }
    },

    async started() {
      // Check the count of items in the DB. If it's empty,
      // call the `seedDB` method of the service.
      if (this.seedDB) {
        const count = await this.adapter.count();
        if (count === 0) {
          this.logger.info(
            `The '${collection}' collection is empty. Seeding the collection...`
          );
          await this.seedDB();
          this.logger.info(
            'Seeding is done. Number of records:',
            await this.adapter.count()
          );
        }
      }
    }
  };

  const url = process.env.MONGO_URI || 'mongodb://localhost:27017/tara_online';
  //let url = undefined;

  if (url) {
    // Mongo adapter
    const MongoAdapter = require('./mongo.adapter');

    schema.adapter = new MongoAdapter(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    schema.collection = collection;
  } else if (process.env.TEST) {
    // NeDB memory adapter for testing
    schema.adapter = new DbService.MemoryAdapter();
  } else {
    // NeDB file DB adapter

    // Create data folder
    if (!fs.existsSync('./data')) {
      mkdir('./data');
    }

    schema.adapter = new DbService.MemoryAdapter({
      filename: `./data/${collection}.db`
    });
  }

  return schema;
};
