'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.Conversation = gql`
    type Conversation {
        _id: String
        name: String
        type: Type
        members: [User]
        chatClosesUsers: [ID]
        productId: Product
        deliveryId: Delivery
        productCustomerId: ProductCustomer
        deliveryCustomerId: DeliveryCustomer
        unreadMessagesCount: Int
        lastMessageId: Message
        lastMessageDate: Date
        createdAt: Date
    }

    enum Type {
        public
        private
    }


    input ConversationInput {
        name: String
        members: [ID]!
        productId: ID
        type: Type
        deliveryId: ID
        productCustomerId: ID
        deliveryCustomerId: ID
        message: String
    }

    input ConversationStartPrivateChatInput {
        recipientUserId: ID!
        message: String!
    }

    input ConversationUpdateInput {
        name: String
        members: [ID]
        lastMessageId: ID
        lastMessageDate: Date
        chatClosesUser: ID
    }
`;
