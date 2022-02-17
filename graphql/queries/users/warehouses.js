'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.warehouses = gql`
    warehouses(
        userId: ID
        page: Int!
        pageSize: Int
    ): Warehouses
`;
