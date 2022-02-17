'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.updateDeliveryAddress = gql`
    updateDeliveryAddress(_id: ID!, data: DeliveryAddressInput): DeliveryAddress
`;
