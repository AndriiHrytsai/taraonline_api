'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.createDeliveryCustomer = gql`
    createDeliveryCustomer(data: DeliveryCustomerInput): DeliveryCustomer
`;
