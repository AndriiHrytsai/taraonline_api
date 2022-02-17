'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.updateAllSeenMessages = gql`
    updateAllSeenMessages(
    conversationId: ID!
    ): ReadAllMessagesFromConversation

`;
