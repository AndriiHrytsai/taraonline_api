'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.conversations = gql`
    conversations(
        senderId: ID!
        page: Int!
        pageSize: Int
    ): ConversationList
`;
