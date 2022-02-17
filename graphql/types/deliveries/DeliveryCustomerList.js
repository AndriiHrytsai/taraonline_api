'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.DeliveryCustomerList = gql`
    type DeliveryCustomerList {
        rows: [DeliveryCustomer]
        total: Int
        page: Int
        pageSize: Int
        totalPages: Int
    }
`;
