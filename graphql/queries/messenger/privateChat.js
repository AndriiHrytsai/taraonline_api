'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.privateChat = gql`
    privateChat(
        recipientUserId: ID
    ): Conversation
`;
