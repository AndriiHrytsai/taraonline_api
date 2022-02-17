'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.DeliveryCustomer = gql`
    type DeliveryCustomer {
        _id: String
        deliveryId: Delivery
        customerId: User
        startAddress: City
        endAddress: City
        freeSpace: Int
        conversationId: Conversation
        ownerId: User
        createdAt: Date
        createdBy: String
        updatedAt: Date
        updatedBy: Date
    }

    input DeliveryCustomerInput {
        deliveryId: ID!
        customerId: ID!
        ownerId: ID!
        message: String!
        startAddress: CityInput!
        endAddress: CityInput!
        freeSpace: Int
        createdBy: String
    }
`;
