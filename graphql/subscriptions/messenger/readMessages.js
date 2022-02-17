'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.readMessages = gql`
    type Subscription {
        readMessages(conversationId: ID!): ReadAllMessagesFromConversation
    }
`;
