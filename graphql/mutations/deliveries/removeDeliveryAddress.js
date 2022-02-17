'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.removeDeliveryAddress = gql`
    removeDeliveryAddress(
    _id: ID!
    ): DeliveryAddress
`;
