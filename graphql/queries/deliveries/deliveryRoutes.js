'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.deliveryRoutes = gql`
    deliveryRoutes(
    page: Int!
    pageSize: Int
    sort: String
    search: String
    deliveryId: ID
    ): DeliveryRouteList
`;
