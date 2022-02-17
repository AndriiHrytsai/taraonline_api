'use strict';

const DbMixin = require('../mixins/db.mixin');
const AuthMixin = require('../mixins/auth.mixin');
const {fileUploader} = require('../utils');

const {
  createAssets,
  deleteAsset,
  deleteAssetList,
} = require('../graphql/mutations/assets');
const {asset, assetsList} = require('../graphql/queries/assets');
const {Asset, AssetsList} = require('../graphql/types/assets');
const {schema, fields, name} = require('../models/assets/asset.model');

module.exports = {
  name: name,

  mixins: [DbMixin(name), AuthMixin],

  settings: {
    /**
     * Available fields in the responses
     */
    fields: fields,

    /**
     * Name of a singe entity
     */
    entityName: name,

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
      type: [Asset, AssetsList],
      resolvers: {
        Asset: {
          userId: {
            action: 'auth.read',
            rootParams: {
              userId: '_id'
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
    read: {
      cache: false,
      params: {
        _id: schema._id
      },
      async handler(ctx) {
        return await this.adapter.findById(ctx.params._id);
      }
    },
    getAsset: {
      cache: false,
      graphql: {
        query: asset
      },
      async handler(ctx) {
        const {itemId, userId} = ctx.params;
        const query = {};
        if (itemId) {
          query.itemId = itemId;
          return await this.adapter.find({query});
        } else if (userId) {
          query.itemId = userId;
          return await this.adapter.findOne(query);
        }


      }
    },
    create: {
      async handler(ctx) {
        const {itemId, mime, url} = ctx?.params;
        const {user} = ctx.meta;

        return await this.adapter.insert({
          itemId,
          mimetype: mime,
          assetUrl: url,
          userId: user?._id,
          createdAt: new Date(),
          isDeleted: false
        });
      }
    },
    createAssets: {
      graphql: {
        mutation: createAssets,
        fileUploadArg: "files",
      },
      cache: false,
      async handler(ctx) {
        console.log('ctx', ctx)
        console.log('ctx?.meta', ctx?.meta)

        const {user, $args: {data: {itemId, model}}, $fileInfo: { filename }} = ctx?.meta;


        const fileChunks = [];

        for await (const chunk of ctx.params) {
          fileChunks.push(chunk);
        }

        const buffer = Buffer.concat(fileChunks);
        const {key, url, mime, size} = await fileUploader.getDataForUpload(model, itemId, buffer);

        await fileUploader.upload(buffer, key, mime);

        return await this.adapter.insert({
          itemId,
          filesize: size,
          filename: filename.replace(/\s/g, ''),
          mimetype: mime,
          assetUrl: url,
          userId: user?._id,
          createdAt: new Date(),
          isDeleted: false
        });
      }
    },
    removeAsset: {
      graphql: {
        mutation: deleteAsset
      },
      params: {
        _id: schema._id
      },
      cache: false,
      async handler(ctx) {
        const {_id} = ctx.params;
        const previous = await this.adapter.findById(_id);
        await fileUploader.deleteFile(previous.assetUrl);
        await this.adapter.removeById(_id);
        return previous;
      }
    },
    removeAssetList: {
      graphql: {
        mutation: deleteAssetList
      },
      cache: false,
      async handler(ctx) {
        const {listId} = ctx.params;
        const query = {};

        if (listId.length) {
          query['$or'] = [];
          listId.map((id) =>
            query['$or'].push({_id: this.adapter.stringToObjectID(id)})
          );
          const assets = await this.adapter.find({query});

          for await (const asset of assets) {
            await fileUploader.deleteFile(asset.assetUrl);
          }

          for await (const asset of assets) {
            await this.adapter.removeById(asset?._id);
          }
          return assets;
        }
      }
    },
    list: {
      graphql: {
        query: assetsList
      },
      cache: false,
      async handler(ctx) {
        const {page = 1, pageSize = -1, itemId} = ctx.params;

        if (!itemId) {
          return null;
        }

        const offset = pageSize * (page - 1);

        const filter = {
          limit: pageSize,
          offset,
          query: {
            itemId
          },
          order: {
            _id: -1
          }
        };
        const rows = await this.adapter.find(filter);

        const totalRes = await this.adapter.count(filter);
        const total = totalRes && totalRes.length > 0 ? totalRes[0].count : 0;
        const totalPages = Math.ceil(total / pageSize);

        return {
          rows,
          page,
          pageSize,
          total,
          totalPages
        };
      }
    }
  },

  /**
   * Hooks
   */
  hooks: {
    after: {
      // async streamAsset(ctx, res) {
      //   try {
      //     this.broker.emit(
      //       'products.updated',
      //       {_id: res.productId},
      //       {
      //         groups: ['products'],
      //         meta: {user: ctx.meta.user}
      //       }
      //     );
      //   } catch (e) {
      //   }
      //   return res;
      // },
      // async removeAsset(ctx, res) {
      //   try {
      //     this.broker.emit(
      //       'products.updated',
      //       {_id: res.productId},
      //       {
      //         groups: ['products'],
      //         meta: {user: ctx.meta.user}
      //       }
      //     );
      //   } catch (e) {
      //   }
      //   return res;
      // }
    }
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
