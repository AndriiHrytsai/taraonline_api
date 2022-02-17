'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.NotificationList = gql`
    type NotificationList {
        rows: [Notification!]!
        total: Int
        page: Int
        pageSize: Int
        totalPages: Int
    }
`;
