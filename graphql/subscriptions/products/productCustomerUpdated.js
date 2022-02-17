'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.productCustomerUpdated = gql`
    type Subscription {
        productCustomerUpdated(_id: ID): ProductCustomer
    }
`;
