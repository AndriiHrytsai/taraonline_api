'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.updateDeliveryCustomer = gql`
    updateDeliveryCustomer(_id: ID!, data: DeliveryCustomerInput): DeliveryCustomer
`;
