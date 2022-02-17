'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.createDeliveryAddress = gql`
    createDeliveryAddress(data: DeliveryAddressInput): DeliveryAddress
`;
