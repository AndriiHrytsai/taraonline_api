'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.productCustomerCreated = gql`
    type Subscription {
        productCustomerCreated(userId: ID): ProductCustomer
    }
`;
