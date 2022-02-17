'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.removeDeliveryRoute = gql`
    removeDeliveryRoute(
    _id: ID!
    ): DeliveryRoute
`;
