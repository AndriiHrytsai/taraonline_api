'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.Delivery = gql`
    type Delivery {
        _id: String
        userId: User
        name: String
        email: String
        phone: String
        description: String
        assets: [Asset]
        canVote: Boolean
        isDriver: Boolean
        deliveryRoutes: [DeliveryRoute]
        createdAt: Date
        createdBy: String
        updatedAt: Date
        updatedBy: Date
        conversationId:Conversation
    }

    input DeliveryInput {
        userId: ID!
        name: String!
        email: String!
        phone: String!
        isDriver: Boolean!
        description: String
        deliveryRoutes: [DeliveryRouteInput]!
    }
`;
