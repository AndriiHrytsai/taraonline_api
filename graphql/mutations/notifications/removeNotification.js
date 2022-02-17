'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.removeNotification = gql`
    removeNotification(
    _id: ID!
    ): Notification!
`;
