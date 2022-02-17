'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.productUpdated = gql`
    type Subscription {
        productUpdated(_id: ID): Product
    }
`;
