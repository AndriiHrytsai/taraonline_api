'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.removeWarehouse = gql`
    removeWarehouse(
        _id: [ID!]!
    ): [Warehouse]
`;
