'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.notificationCreated = gql`
    type Subscription {
        notificationCreated(userId: ID!): Notification
    }
`;
