'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.updateManyNotifications = gql`
    updateManyNotifications(
    ids: [ID]!
    ): [Notification!]!
`;
