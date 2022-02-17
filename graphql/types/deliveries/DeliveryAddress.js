'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.DeliveryAddress = gql`
    type DeliveryAddress {
        _id: String
        placeId: String
        placeName: String
        latitude: String
        longitude: String
        houseNumber: String
        streetName: String
        createdAt: Date
        createdBy: String
        updatedAt: Date
        updatedBy: Date
    }

    input DeliveryAddressInput {
        placeId: String!
        placeName: String!
        latitude: String!
        longitude: String!
        houseNumber: String!
        streetName: String!
    }
`;
