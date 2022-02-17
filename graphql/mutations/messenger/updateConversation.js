'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.updateConversation = gql`
    updateConversation(
        _id: ID! 
        data: ConversationUpdateInput!
    ): Conversation
`;
