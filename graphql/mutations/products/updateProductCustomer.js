'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.updateProductCustomer = gql`
    updateProductCustomer(_id: ID!, data: UpdateProductCustomerInput!): ProductCustomer!
`;
