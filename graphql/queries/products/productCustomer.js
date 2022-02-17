'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.productCustomer = gql`
    productCustomer(
    _id: ID
    productId: ID
    ownerId: ID
    customerId: ID
    ): ProductCustomer
`;
