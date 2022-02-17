'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.DeliveryAddressList = gql`
    type DeliveryAddressList {
        rows: [DeliveryAddress]
        total: Int
        page: Int
        pageSize: Int
        totalPages: Int
    }
`;
