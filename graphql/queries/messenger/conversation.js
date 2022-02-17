'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.conversation = gql`
    conversation(
        _id: ID
        recipientUserId: ID
        type: Type
    ): Conversation
`;
