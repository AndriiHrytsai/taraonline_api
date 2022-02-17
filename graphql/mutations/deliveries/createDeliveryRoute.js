'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.createDeliveryRoute = gql`
    createDeliveryRoute(data: DeliveryRouteInput): DeliveryRoute
`;
