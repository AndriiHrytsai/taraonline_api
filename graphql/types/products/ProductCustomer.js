'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.ProductCustomer = gql`
    type ProductCustomer {
        _id: ID
        assets:[Asset]
        customerId: User
        ownerId: User
        productId: Product
        conversationId: Conversation
        count: Int
        houseNumber: String
        streetName: String
        city: City
        price: Float
        createdAt: Date
        updatedAt: Date
        isApproved: Boolean
        isFinished: Boolean
        isOwnerTransport: Boolean
        dateLoad: Date
        isDeleted: Boolean

    }

    input ProductCustomerInput {
        customerId: ID!
        ownerId: ID!
        productId: ID!
        count: Int
        price: Float
        houseNumber: String
        streetName: String
        city: CityInput
        message: String
    }

    input UpdateProductCustomerInput {
        count: Int!
        price: Float!
        houseNumber: String
        streetName: String
        city: CityInput
        message: String
        isApproved: Boolean!
        isFinished: Boolean!
        isOwnerTransport: Boolean!
        dateLoad: Date!
    }
`;
