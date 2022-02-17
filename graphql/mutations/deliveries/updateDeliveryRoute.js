'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.updateDeliveryRoute = gql`
    updateDeliveryRoute(_id: ID!, data: DeliveryRouteInput): DeliveryRoute
`;
