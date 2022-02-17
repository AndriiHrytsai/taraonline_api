'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.createConversation = gql`
    createConversation(data: ConversationInput): Conversation
`;
