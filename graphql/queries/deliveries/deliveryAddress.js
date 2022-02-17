'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.deliveryAddress = gql`
    deliveryAddress(
    _id: ID
    ): DeliveryAddress
`;
