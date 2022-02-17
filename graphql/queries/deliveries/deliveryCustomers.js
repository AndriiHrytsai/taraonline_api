'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.deliveryCustomers = gql`
    deliveryCustomers(
    page: Int!
    pageSize: Int
    sort: String
    search: String
    ): DeliveryCustomerList
`;
