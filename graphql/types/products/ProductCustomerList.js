'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.ProductCustomerList = gql`
    type ProductCustomerList {
        rows: [ProductCustomer]
        total: Int
        page: Int
        pageSize: Int
        totalPages: Int
    }
`;
