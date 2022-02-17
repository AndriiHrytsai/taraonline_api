'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.removeDeliveryCustomer = gql`
    removeDeliveryCustomer(
    _id: ID!
    ): DeliveryCustomer
`;
