'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.ConversationList = gql`
    type ConversationList {
        rows: [Conversation]
        total: Int
        page: Int
        pageSize: Int
        totalPages: Int
    }
`;
