'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.removeManyByConversationId = gql`
    removeManyByConversationId(
    _id: ID!
    ): Boolean
`;
