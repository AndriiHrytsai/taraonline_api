'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.startPrivateChat = gql`
    startPrivateChat(data: ConversationStartPrivateChatInput): Conversation
`;
