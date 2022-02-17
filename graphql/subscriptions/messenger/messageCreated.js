'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.messageCreated = gql`
    type Subscription {
        messageCreated(userId: ID!, conversationId: ID!): Message
    }
`;
