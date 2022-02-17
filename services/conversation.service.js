'use strict';

const moment = require('moment');
const DbMixin = require('../mixins/db.mixin');
const {conversation, conversations, privateChat} = require('../graphql/queries/messenger');
const {
  createConversation,
  updateConversation,
  removeConversation,
  startPrivateChat
} = require('../graphql/mutations/messenger');
const {Conversation, ConversationList} = require('../graphql/types/messenger');
const {conversationCreated, conversationUpdated} = require('../graphql/subscriptions/messenger');
const {schema, fields} = require('../models/messenger/message.model');
const AuthMixin = require("../mixins/auth.mixin");

module.exports = {
  name: 'conversations',

  /**
   * Mixins
   */
  mixins: [DbMixin('conversations'), AuthMixin],

  /**
   * Settings
   */
  settings: {
    entityName: 'conversations',
    // Available fields in the responses
    fields: fields,
    // Validator for the `create` & `insert` actions.
    entityValidator: schema,
    entityRevisions: true,
    graphql: {
      /**
       * Company type definition
       */
      type: [Conversation, ConversationList],
      resolvers: {
        Conversation: {
          members: {
            action: 'auth.read',
            rootParams: {
              members: '_id'
            }
          },
          lastMessageId: {
            action: 'messages.read',
            rootParams: {
              lastMessageId: '_id'
            }
          },
          productId: {
            action: 'products.read',
            rootParams: {
              productId: '_id'
            }
          },
          deliveryId: {
            action: 'deliveries.read',
            rootParams: {
              deliveryId: '_id'
            }
          },
          deliveryCustomerId: {
            action: 'deliveryCustomers.read',
            rootParams: {
              deliveryCustomerId: '_id'
            }
          },
          productCustomerId: {
            action: 'productCustomers.read',
            rootParams: {
              productCustomerId: '_id'
            }
          },
          unreadMessagesCount: {
            action: 'messages.getUnreadMessagesCount',
            rootParams: {
              _id: 'conversationId'
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
   * These actions using mixin javascript technology.
   * These are defined in db-mixins
   */
  actions: {
    checkUserInGroupChat: {
      cache: false,
      async handler(ctx) {
        const {userId} = ctx.params;
        const conversation = await this.adapter.findOne({type: 'public'});
        if (conversation?.members.indexOf(userId) === -1) {
          await this.adapter.updateById(conversation?._id, {members: [...conversation?.members, userId]});
        }
      }
    },
    startPrivateChat: {
      graphql: {
        mutation: startPrivateChat
      },
      async handler(ctx) {
        const {
          data: {
            recipientUserId,
            name = null,
            message,
            productId = null,
            deliveryId = null,
            deliveryCustomerId = null,
            productCustomerId = null,
            createdAt = new Date(),
            isDeleted = false,
            type = 'private',
            unreadMessagesCount = null
          }
        } = ctx.params;
        const userId = ctx?.meta?.user?._id;

        const conversation = await this.adapter.insert({
          members: [recipientUserId, userId],
          createdAt,
          isDeleted,
          type,
          name,
          productId,
          deliveryId,
          deliveryCustomerId,
          productCustomerId,
          unreadMessagesCount
        });

        if (!message) return null;

        const newMessage = await ctx.call('messages.create', {
          data: {
            conversationId: conversation._id,
            userId,
            message
          }
        });

        if (newMessage) {
          conversation.lastMessageId = { message }
          conversation.lastMessageDate = newMessage.createdAt || new Date();
        }

        return conversation;
      }
    },
    create: {
      graphql: {
        mutation: createConversation
      },
      async handler(ctx) {
        const userId = ctx?.meta?.user?._id;
        const {
          data: {
            members,
            name,
            productId = null,
            deliveryId = null,
            deliveryCustomerId = null,
            productCustomerId = null,
            createdAt = new Date(),
            isDeleted = false,
            type = 'private',
            unreadMessagesCount = null,
            message = null
          }
        } = ctx.params;

        const recentConversation = await this.adapter.findOne({
          members,
          name,
          type,
          productId,
          deliveryId,
          isDeleted
        });

        if (recentConversation) {
          return recentConversation;
        }

        const newConversation = await this.adapter.insert({
          members,
          createdAt,
          isDeleted,
          type,
          name,
          productId,
          deliveryId,
          deliveryCustomerId,
          productCustomerId,
          unreadMessagesCount,
          chatClosesUsers: []
        });

        if (message) {
          await ctx.call('messages.create', {
            data: {
              conversationId: newConversation._id,
              userId,
              message
            }
          });
        }

        return newConversation
      }
    },
    read: {
      cache: false,
      graphql: {
        query: conversation,
      },
      async handler(ctx) {
          return await this.adapter.findById(ctx.params._id);
      }
    },
    findPrivatChat: {
      cache: false,
      graphql: {
        query: privateChat,
      },
      async handler(ctx) {
        const userId = ctx.meta.user._id;

        const { recipientUserId } = ctx.params

        return this.adapter.findOne({
          members: { $all: [userId, recipientUserId] },
          chatClosesUsers: { $nin: [userId] },
          type: 'private',
          productId: null,
          isDeleted: false,
        });
      }
    },
    readByItemId: {
        cache: false,
        async handler(ctx) {
            const {ownerId, productId, deliveryId} = ctx.params;
            const userId = ctx.meta.user._id;
            if (productId) {
                return await this.adapter.findOne({
                    productId,
                    members: {$all: [userId, ownerId]},
                    chatClosesUsers: { $nin: [userId] }
                });
            } else if (deliveryId) {
                return await this.adapter.findOne({
                    deliveryId,
                    members: {$all: [userId, ownerId]},
                    chatClosesUsers: { $nin: [userId] }
                });
            }
        }
    },
    update: {
      graphql: {
        mutation: updateConversation
      },
      async handler(ctx) {
        const { _id, data } = ctx.params;

        const prev =  await this.adapter.findById(_id)
        let chatClosesUsers = prev?.chatClosesUsers ? prev?.chatClosesUsers : []
        const closesUserId = data.chatClosesUser
        let isDeleted = false

        if (closesUserId && prev.type === 'private') {
          if (!!chatClosesUsers.find((prevId) => prevId === closesUserId)) {
            chatClosesUsers = chatClosesUsers.filter((prevId) => prevId !== closesUserId)
          } else {
            chatClosesUsers = [...chatClosesUsers, closesUserId]
          }
          delete data.chatClosesUser

          if (prev?.members?.length === chatClosesUsers?.length) {
            isDeleted = true
          }
        }

        if (isDeleted) {
          await ctx.call('messages.deleteManyByConversationId', { conversationId: _id });
        }

        return await this.adapter.updateById(_id, { ...data, chatClosesUsers, isDeleted });
      }
    },
    delete: {
      graphql: {
        mutation: removeConversation
      },
      params: {
        _id: schema._id
      },
      async handler(ctx) {
        const {_id} = ctx.params;
        try {
          const conversation = await this.adapter.updateById(_id, { isDeleted: true });
          await ctx.call('messages.deleteManyByConversationId', { conversationId: _id });
          return conversation;
        } catch (err) {
          console.error(err);
          return null;
        }
      }
    },
    listToDate: {
      cache: false,
      async handler(ctx) {
        const {date, type} = ctx.params;
        const query = {
          lastMessageDate: {
            $lte: date
          },
          isDeleted: false,
          type
        }
        return await this.adapter.find({
          query
        });
      }
    },
    list: {
      graphql: {
        query: conversations
      },
      cache: false,
      async handler(ctx) {
        const {page = 1, pageSize = 100, senderId} = ctx.params;
        const query = {
          members: { $in: [senderId] },
          chatClosesUsers: { $nin: [senderId] },
          isDeleted: false
        }
        const offset = pageSize * (page - 1);

        const items = await this.adapter.find({
          query,
          offset,
          limit: pageSize,
          order: {
            lastMessageDate: 1
          }
        });

        const total = await this.adapter.count({
          query: {
            members: {
              $in: [senderId]
            },
            chatClosesUsers: { $nin: [senderId] },
            isDeleted: false
          },
        });

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
    conversationCreatedSub: {
      graphql: {
        subscription: conversationCreated,
        tags: ['conversationCreatedSub']
      },
      async handler(ctx) {
        const payload = ctx.params.payload;
        const {userId} = ctx.params;
        return payload.members.indexOf(userId) !== -1 ? payload : null;
      }
    },
    conversationUpdatedSub: {
      graphql: {
        subscription: conversationUpdated,
        tags: ['conversationUpdatedSub']
      },
      async handler(ctx) {
        const payload = ctx.params.payload;
        const {userId} = ctx.params;
        return payload.members.indexOf(userId) !== -1 ? payload : null;
      }
    },
    getAllRecentConversation: {
      params: {
        _id: schema._id
      },
      async handler(ctx) {
        const {
          startDate = moment.utc(new Date()).subtract(5, 'minutes').format('YYYY-MM-DDTHH:mm:ssZ'),
          endDate = moment.utc(new Date()).format('YYYY-MM-DDTHH:mm:ssZ')
        } = ctx.params;

        const query = {
          lastMessageDate: {
            $gte: startDate,
            $lt: endDate
          },
          type: 'private'
        };

        const filter = {
          query,
          order: {
            lastMessageDate: 1
          }
        };

        return this.adapter.find(filter);
      }
    }
  },

  /**
   * Events
   */

  events: {
    'conversation.created': {
      handler(payload) {
        this.logger.info('Conversation created:', payload);
      }
    },
    'conversation.updated': {
      handler(payload) {
        this.logger.info('Conversation updated:', payload);
      }
    },
    'conversation.deleted': {
      handler(payload) {
        this.logger.info('Conversation deleted:', payload);
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
          tag: 'conversationCreatedSub',
          payload: res
        });
        return res;
      },
      async update(ctx, res) {
        await ctx.broadcast('graphql.publish', {
          tag: 'conversationUpdatedSub',
          payload: res
        });
        return res;
      },
      async deleteMessage(ctx, res) {
        this.broker.emit('conversation.deleted', res, ['']);
        return res;
      }
    }
  },

  /**
   * Methods
   */
  methods: {
    async seedDB() {
      const DATE = new Date();
      await this.adapter.insertMany([
        {
          members: [],
          name: 'Public Chat',
          type: 'public',
          productCustomerId: null,
          deliveryCustomerId: null,
          unreadMessagesCount: null,
          createdAt: DATE,
          chatClosesUsers: [],
          isDeleted: false
        },
      ]);
    }
  },

  /**
   * Fired after database connection establishing.
   */
  async afterConnected() {
    this.logger.info('Conversation service connected successfully');
  },

  async created() {
  },

  async started() {
  },

  async stopped() {
  }
};
