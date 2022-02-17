'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.createNotification = gql`
    createNotification(data: NotificationInput!): Notification!
`;
