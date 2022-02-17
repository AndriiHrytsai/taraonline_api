'use strict';

const _ = require("lodash");
const {MoleculerClientError, MoleculerError} = require('moleculer').Errors;
const moment = require('moment');
const DbMixin = require('../mixins/db.mixin');
const AuthMixin = require("../mixins/auth.mixin");
const {message, messages} = require('../graphql/queries/messenger');
const {
  createMessage,
  removeMessage,
  updateMessage,
  removeManyByConversationId,
  updateAllSeenMessages
} = require('../graphql/mutations/messenger');
const {Message, MessageList} = require('../graphql/types/messenger');
const {schema, fields} = require('../models/messenger/message.model');
const {messageUpdated, messageCreated, readMessages} = require("../graphql/subscriptions/messenger");

module.exports = {
  name: 'messages',

  /**
   * Mixins
   */
  mixins: [DbMixin('messages'), AuthMixin],

  /**
   * Settings
   */
  settings: {
    entityName: 'messages',
    // Available fields in the responses
    fields: fields,
    // Validator for the `create` & `insert` actions.
    entityValidator: schema,
    entityRevisions: true,
    graphql: {
      type: [Message, MessageList],
      resolvers: {
        Message: {
          userId: {
            action: 'auth.read',
            rootParams: {
              "userId": '_id'
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
   * These actions using mixin javascript technology.
   * These are defined in db-mixins
   */
  actions: {
    create: {
      graphql: {
        mutation: createMessage
      },
      async handler(ctx) {
        const {
          data: {
            userId,
            conversationId,
            message,
            seen = false,
            createdAt = new Date(),
            isDeleted = false
          }
        } = ctx.params;

        // if (!message ) throw new MoleculerClientError('Message not provided', 401, 'MESSAGE_NOT_PROVIDED');

        const user = await ctx.call('auth.read', {_id: userId});

        if (!user)
          throw new MoleculerError(
            "User not found!",
            404,
            "USER_NOT_FOUND",
            {
              userId,
            }
          );


        const conversation = await ctx.call('conversations.read', {_id: conversationId});

        if (!conversation)
          throw new MoleculerError(
            "Conversation not found!",
            404,
            "CONVERSATION_NOT_FOUND",
            {
              conversationId,
            }
          );


        if (conversation.type === 'public' && user.banned)
          throw new MoleculerClientError('User banned!', 403, 'USER_BANNED');

        return await this.adapter.insert({userId, conversationId, message, seen, createdAt, isDeleted});
      }
    },
    read: {
      cache: false,
      graphql: {
        query: message
      },
      async handler(ctx) {
        const result = await this.adapter.findById(ctx.params._id);
        if (result) {
          result.conversationId = await ctx.call('conversations.read', { _id: result.conversationId });
        }
        return _.cloneDeep(result);
      }
    },
    delete: {
      graphql: {
        mutation: removeMessage
      },
      params: {
        _id: schema._id
      },
      async handler(ctx) {
        const {_id} = ctx.params;
        return await this.adapter.updateById(_id, { isDeleted: true, updatedAt: new Date()  });
      }
    },
    update: {
      graphql: {
        mutation: updateMessage
      },
      params: {
        _id: schema._id
      },
      async handler(ctx) {
        const {_id, data} = ctx.params;
        return await this.adapter.updateById(_id, { ...data, updatedAt: new Date() });
      }
    },
    deleteManyByConversationId: {
      graphql: {
        mutation: removeManyByConversationId
      },
      params: {
        conversationId: schema.conversationId
      },
      async handler(ctx) {
        const {conversationId} = ctx.params;
        await this.adapter.updateMany({conversationId: conversationId}, { isDeleted: true, updatedAt: new Date() });
        return true;
      }
    },
    allList: {
      cache: false,
      async handler(ctx) {
        const {conversationId = ''} = ctx.params;
        return await this.adapter.find({
          query: {conversationId}
        });
      }
    },
    list: {
      cache: false,
      graphql: {
        query: messages
      },
      async handler(ctx) {
        const {page = 1, pageSize = 20, conversationId = ''} = ctx.params;
        const offset = pageSize * (page - 1);
        const items = await this.adapter.find({
          query: {conversationId},
          sort: {
            createdAt: -1
          },
          offset,
          limit: pageSize
        });
        const total = await this.adapter.count({query: {conversationId}});
        const totalPages = Math.ceil(total / pageSize);
        const conversation = await ctx.call('conversations.read', {_id: conversationId});
        return {
          conversationId: conversation,
          rows: items,
          page,
          pageSize,
          total,
          totalPages
        }
      }
    },
    updateAllSeenMessages: {
      cache: false,
      params: {
        conversationId: schema._id
      },
      graphql: {
        mutation: updateAllSeenMessages
      },
      async handler(ctx) {
        const {conversationId} = ctx.params;
        const conversation = await ctx.call('conversations.read', {_id: conversationId});
        const currentUserId = ctx?.meta?.user?._id;
        let messages;

        try {
          if (conversation?.members?.length === 2) {
            if (conversation.members[0] === currentUserId) {
              messages = await this.adapter.find({
                query: {
                  conversationId,
                  userId: conversation.members[1],
                  seen: false
                }
              });
              await this.adapter.updateMany({conversationId, userId: conversation.members[1]}, {seen: true});

            } else if (conversation.members[1] === currentUserId) {
              messages = await this.adapter.find({
                query: {
                  conversationId,
                  userId: conversation.members[0], seen: false
                }
              });
              await this.adapter.updateMany({
                conversationId,
                userId: conversation.members[0]
              }, {seen: true});
            } else {
              messages = await this.adapter.find({
                query: {
                  conversationId,
                  seen: false
                }
              })

              await this.adapter.updateMany({conversationId}, {seen: true});
            }
          } else if (conversation?.members?.length > 2) {
            const allMembers = conversation.members.filter(member => member !== currentUserId);
            messages = await this.adapter.find({
              query: {
                conversationId,
                $or: allMembers.map(userId => {
                  return {
                    userId
                  }
                }),
                seen: false
              }
            });

            await this.adapter.updateMany({
              conversationId,
              $or: allMembers.map(userId => {
                return {
                  userId
                }
              })
            }, {seen: true});
          }
          if (messages.length) {
            const res = {
              messagesIds: messages.map(message => message._id),
              conversationId
            }
            await ctx.broadcast('graphql.publish', {
              tag: 'readMessagesSub',
              payload: res
            });

            return res;
          } else {
            return {messagesIds: [], conversationId};
          }
        } catch (err) {
          this.logger.error(err);
          return {messagesIds: [], conversationId};
        }
      }
    },
    getUnreadMessagesCount: {
      params: {
        conversationId: schema._id
      },
      handler(ctx) {
        const {conversationId} = ctx.params;
        const userId = ctx?.meta?.user?._id;
        return this.adapter.count({query: {conversationId, seen: false, userId: {$ne: userId}}});
      }
    },
    getAllRecentConversationMessages: {
      params: {
        conversationId: schema._id
      },
      async handler(ctx) {
        const {
          startDate = moment.utc(new Date()).subtract(5, 'minutes').format('YYYY-MM-DDTHH:mm:ssZ'),
          conversationId,
        } = ctx.params;

        let query = {
          seen: false,
          isDeleted: false,
          conversationId: conversationId,
          createdAt: {
            $gte: new Date(startDate)
          }
        };

        const filter = {
          query,
          order: {
            createdAt: 1
          }
        }
        return this.adapter.find(filter);
      }
    },
    messageUpdatedSub: {
      graphql: {
        subscription: messageUpdated,
        tags: ['messageUpdatedSub']
      },
      handler(ctx) {
        const payload = ctx.params.payload;
        const {userId, conversationId} = ctx.params;
        return payload.userId !== userId && payload.conversationId === conversationId ? payload : undefined;
      }
    },
    messageCreatedSub: {
      graphql: {
        subscription: messageCreated,
        tags: ['messageCreatedSub']
      },
      handler(ctx) {
        const payload = ctx.params.payload;
        const {userId, conversationId} = ctx.params;
        return payload.userId !== userId && payload.conversationId === conversationId ? payload : undefined;
      }
    },
    readMessages: {
      graphql: {
        subscription: readMessages,
        tags: ['readMessagesSub']
      },
      handler(ctx) {
        const payload = ctx.params.payload;
        const {conversationId} = ctx.params;

        return payload.conversationId === conversationId ? payload : undefined;
      }
    }
  },

  /**
   * Events
   */
  events: {
    'messages.created': {
      handler(payload) {
        this.logger.info('messages created:', payload);
      }
    },
    'messages.updated': {
      handler(payload) {
        this.logger.info('messages updated:', payload);
      }
    },
    'messages.deleted': {
      handler(payload) {
        this.logger.info('messages deleted:', payload);
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
          tag: 'messageCreatedSub',
          payload: res
        });

        try {
          await ctx.call('conversations.update', {
            _id: res.conversationId,
            data: {lastMessageDate: res?.createdAt, lastMessageId: res?._id}
          });
        } catch (err) {
          console.log(err);
        }
        return res;
      },
      async update(ctx, res) {
        await ctx.broadcast('graphql.publish', {
          tag: 'messageUpdatedSub',
          payload: res
        });
        return res;
      },
      async deleteMessage(ctx, res) {
        this.broker.emit('messages.deleted', res, ['']);
        return res;
      },
    }
  },

  /**
   * Methods
   */
  methods: {},

  /**
   * Fired after database connection establishing.
   */
  async afterConnected() {
    this.logger.info('Message service connected successfully');
  },

  async created() {
  },

  async started() {
  },

  async stopped() {
  }
};
