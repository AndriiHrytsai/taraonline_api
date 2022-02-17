'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.conversationCreated = gql`
    type Subscription {
        conversationCreated(userId: ID!): Conversation
    }
`;
