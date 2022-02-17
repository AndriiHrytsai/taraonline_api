'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.DeliveryRoute = gql`
    type DeliveryRoute {
        _id: String
        deliveryId: Delivery
        price: Float
        freeSpace: Int
        space: Int
        startAddress: DeliveryAddress
        endAddress: DeliveryAddress
        startDate: Date
        endDate: Date
        createdAt: Date
        createdBy: String
        updatedAt: Date
        updatedBy: Date
    }

    input DeliveryRouteInput {
        deliveryId: ID
        price: Float!
        freeSpace: Int
        space: Int
        startAddress: DeliveryAddressInput!
        endAddress: DeliveryAddressInput
        startDate: Date!
        endDate: Date
    }
`;
