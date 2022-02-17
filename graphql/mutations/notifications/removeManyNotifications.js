'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.removeManyNotifications = gql`
    removeManyNotifications(
    ids: [ID]!
    ): [Notification!]!
`;
