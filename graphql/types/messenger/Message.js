'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.Message = gql`
    type Message {
        _id: ID
        userId: User
        conversationId: Conversation
        message: String
        seen: Boolean,
        assets: [Asset],
        createdAt: Date
        updatedAt: Date
        isDeleted: Boolean
    }

    input MessageInput {
        conversationId: ID!
        userId: ID!
        message: String!
    }
    
    input MessageUpdateInput {
        message: String!
    }

    input UpdateMessageInput {
        seen: Boolean!
    }

    type ReadAllMessagesFromConversation {
        messagesIds: [ID],
        conversationId: ID
    }
`;
