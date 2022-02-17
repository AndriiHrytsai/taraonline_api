'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.removeDelivery = gql`
    removeDelivery(
    _id: ID!
    ): Delivery
`;
