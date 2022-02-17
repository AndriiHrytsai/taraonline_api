'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.removeProductCustomer = gql`
    removeProductCustomer(
    _id: ID!
    ): ProductCustomer
`;
