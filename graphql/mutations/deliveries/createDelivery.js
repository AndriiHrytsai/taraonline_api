'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.createDelivery = gql`
    createDelivery(data: DeliveryInput!): Delivery
`;
