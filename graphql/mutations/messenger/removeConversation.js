'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.removeConversation = gql`
    removeConversation(
        _id: ID!
    ): Conversation
`;
