'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.notificationDeleted = gql`
    type Subscription {
        notificationDeleted(userId: ID!): Notification
    }
`;
