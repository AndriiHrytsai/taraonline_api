'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.warehouse = gql`
    warehouse(
        _id: ID!
    ): Warehouse
`;
