'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.messageUpdated = gql`
    type Subscription {
        messageUpdated(userId: ID!, conversationId: ID!): Message
    }
`;
