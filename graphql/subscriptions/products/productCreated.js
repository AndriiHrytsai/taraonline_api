'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.productCreated = gql`
    type Subscription {
        productCreated(userId: ID): Product
    }
`;
