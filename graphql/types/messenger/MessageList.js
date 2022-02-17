'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.MessageList = gql`
    type MessageList {
        conversationId: Conversation
        rows: [Message]
        total: Int
        page: Int
        pageSize: Int
        totalPages: Int
    }
`;
