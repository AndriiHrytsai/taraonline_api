'use strict';

const Cron = require('moleculer-cron');
const moment = require('moment');
const mail = require('./../utils/mail');

module.exports = {
  name: 'messenger-cron-job',

  mixins: [Cron],

  crons: [
    // {
    //   name: 'unread-message-scheduler',
    //   cronTime: '*/5 * * * *',
    //   onTick: function () {
    //     console.log('unread-message-scheduler ticked: ', moment.utc(new Date()).format('YYYY-MM-DDTHH:mm:ssZ'));
    //
    //     this.getLocalService('messenger-cron-job')
    //       .actions.getUnreadMessages()
    //       .then(() => {
    //         console.log('Unread messages send to emails!');
    //       });
    //   },
    //   runOnInit: function () {
    //     console.log('Starting unread message scheduler');
    //   }
    // },
    {
      name: 'unlock-users-scheduler',
      cronTime: '*/5 * * * * ',
      onTick: function () {
        console.log('unlock-users-scheduler ticked: ', moment.utc(new Date()).format('YYYY-MM-DDTHH:mm:ssZ'));

        this.getLocalService('messenger-cron-job')
          .actions.checkUsersToUnlock()
          .then(() => {
            console.log('User unlocked by time!');
          });
      },
      runOnInit: function () {
        console.log('Starting unlock users scheduler');
      }
    },
    {
      name: 'delete-messages-scheduler',
      cronTime: '0 23 * * *',
      onTick: function () {
        console.log('delete-messages-scheduler ticked: ', moment.utc(new Date()).format('YYYY-MM-DDTHH:mm:ssZ'));

        this.getLocalService('messenger-cron-job')
            .actions.deleteMessages()
            .then(() => {
              console.log('Messages deleted by time!');
            });
      },
      runOnInit: function () {
        console.log('Starting delete messages scheduler');
      }
    }
  ],

  actions: {
    deleteMessages: {
      async handler(ctx) {
        // The date that was seven days ago
        let lastDate = new Date();
        lastDate.setDate(lastDate.getDate()-7);
        lastDate = moment.utc(lastDate).format('YYYY-MM-DDTHH:mm:ssZ');

        // Get all old messages
        const conversations = await ctx.call('conversations.listToDate', {date: lastDate, type: 'public'});

        if (conversations?.length) {
          for await (const conversation of conversations) {
            // Get all messages by conversation which need to delete before delete conversation
            const messages = await ctx.call('messages.allList', {conversationId: conversation._id});

            const statements = messages.map(async (message) => {
              let result = await ctx.call('messages.delete', {_id: message._id});
              result = result && result.length > 0 ? result[0] : null;
              return result;
            })

            Promise.all(statements).then(values => {
              console.log(values);
              ctx.call('conversations.delete', {_id: conversation._id});
            });
          }
        }
      }
    },
    checkUsersToUnlock: {
      async handler(ctx) {
        const users = await ctx.call('auth.findByQuery', {
          query: {
            banned: true,
            banExpiration: {$gte: new Date()}
          },
          limit: 0
        });

        if (users?.length) {
          for await (const user of users) {
            await ctx.call('auth.unlockUser', {userId: user._id});
          }
        }
      }
    },
    getUnreadMessages: {
      async handler(ctx) {
        const startDate = moment.utc(new Date()).subtract(5, 'minutes').format('YYYY-MM-DDTHH:mm:ssZ');
        const endDate = moment.utc(new Date()).format('YYYY-MM-DDTHH:mm:ssZ');
        const conversations = await ctx.call('conversations.getAllRecentConversation', {
          startDate,
          endDate
        });

        for await (const conversation of conversations) {
          const senderUserId = conversation?.members[0];
          const receiverUserId = conversation?.members[1];
          const messages = await ctx.call('messages.getAllRecentConversationMessages', {
            conversationId: conversation?._id,
            startDate,
          });
          // console.log('All conversations messages where conversationId: ', conversation?._id, ', total messages: ', messages?.length);
          if (messages.length > 0) {
            const creator = await ctx.call('auth.read', {_id: senderUserId});
            const collaborator = await ctx.call('auth.read', {_id: receiverUserId});
            const lastMessageDetail = await ctx.call('messages.read', {_id: conversation.lastMessageId});

            const userDetail = {
              [senderUserId]: `${creator?.firstName || creator?.username || creator?.email}`,
              [receiverUserId]: `${collaborator?.firstName || collaborator?.username || collaborator?.email}`
            };

            let email = '';
            let subject = 'You have unread messages';
            if (lastMessageDetail?.userId === senderUserId) {
              email = collaborator?.email;
              subject = `You have unread messages from ${userDetail[senderUserId]}`;
            } else if (lastMessageDetail?.userId === receiverUserId) {
              email = creator?.email;
              subject = `You have unread messages from ${userDetail[receiverUserId]}`;
            }

            const messagesContent = [];
            messages.map((messageItem) => {
              messagesContent.push(`${userDetail[messageItem.userId]}: ${messageItem.message}`)
            });
            await mail.sendUnreadMessagesToEmail(email, subject, messagesContent);
          }
        }
      }
    }
  }
}
