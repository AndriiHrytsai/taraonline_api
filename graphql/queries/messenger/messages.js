'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.messages = gql`
    messages(
        conversationId: ID!
        page: Int!
        pageSize: Int
    ): MessageList
`;
