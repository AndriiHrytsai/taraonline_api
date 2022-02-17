'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.DeliveryRouteList = gql`
    type DeliveryRouteList {
        rows: [DeliveryRoute]
        total: Int
        page: Int
        pageSize: Int
        totalPages: Int
    }
`;
