'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.notificationUpdated = gql`
    type Subscription {
        notificationUpdated(userId: ID!): Notification
    }
`;
