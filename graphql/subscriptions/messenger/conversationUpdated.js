'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.conversationUpdated = gql`
    type Subscription {
        conversationUpdated(userId: ID!): Conversation
    }
`;
