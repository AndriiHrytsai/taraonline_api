'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.deliveryAddresses = gql`
    deliveryAddresses(
    page: Int!
    pageSize: Int
    sort: String
    search: String
    ): DeliveryAddressList
`;
