'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.deliveryRoute = gql`
    deliveryRoute(
    _id: ID
    ): DeliveryRoute
`;
