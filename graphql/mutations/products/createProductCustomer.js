'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.createProductCustomer = gql`
    createProductCustomer(data: ProductCustomerInput): ProductCustomer
`;
