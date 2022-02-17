'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.deliveries = gql`
    deliveries(
    page: Int!
    pageSize: Int
    sort: String
    search: String
    userId: ID
    ): DeliveryList
`;
