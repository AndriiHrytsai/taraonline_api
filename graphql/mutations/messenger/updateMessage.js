'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.updateMessage = gql`
    updateMessage(
        _id: ID!
        data: MessageUpdateInput!
    ): Message
`;
