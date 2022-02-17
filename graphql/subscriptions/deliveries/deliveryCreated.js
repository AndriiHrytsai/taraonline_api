'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.deliveryCreated = gql`
    type Subscription {
        deliveryCreated(userId: ID!): Delivery
    }
`;
