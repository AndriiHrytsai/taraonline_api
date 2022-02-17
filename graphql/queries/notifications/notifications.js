'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.notifications = gql`
    notifications(
    userId: ID!
    page: Int!
    pageSize: Int
    seen: Boolean
    ): NotificationList!
`;
