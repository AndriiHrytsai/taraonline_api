'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.Warehouses = gql`
    type Warehouses {
        rows: [Warehouse]
        total: Int
        page: Int
        pageSize: Int
        totalPages: Int
    }
`;
