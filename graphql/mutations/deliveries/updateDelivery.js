'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.updateDelivery = gql`
    updateDelivery(_id: ID!, data: DeliveryInput, files: [Upload]): Delivery
`;
