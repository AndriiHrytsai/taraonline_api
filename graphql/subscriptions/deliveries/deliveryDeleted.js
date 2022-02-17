'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.deliveryDeleted = gql`
    type Subscription {
        deliveryDeleted(_id: ID!): Delivery
    }
`;
