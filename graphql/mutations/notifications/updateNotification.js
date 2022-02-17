'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.updateNotification = gql`
    updateNotification(
    _id: ID!
    ): Notification!
`;
