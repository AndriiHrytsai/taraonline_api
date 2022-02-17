'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.deliveryUpdated = gql`
    type Subscription {
        deliveryUpdated(_id: ID!): Delivery
    }
`;
