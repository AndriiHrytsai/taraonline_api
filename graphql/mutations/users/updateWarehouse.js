'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.updateWarehouse = gql`
    updateWarehouse(
        _id: ID!
        data: WarehouseUpdateInput!
    ): Warehouse
`;
