'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.createWarehouse = gql`
    createWarehouse(
        data: [WarehouseInput!]!
    ): [Warehouse]
`;
