'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.deliveryCustomer = gql`
    deliveryCustomer(
    _id: ID
    ): DeliveryCustomer
`;
