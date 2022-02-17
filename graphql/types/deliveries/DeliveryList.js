'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.DeliveryList = gql`
    type DeliveryList {
        rows: [Delivery]
        total: Int
        page: Int
        pageSize: Int
        totalPages: Int
    }
`;
