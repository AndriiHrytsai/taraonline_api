'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.removeMessage = gql`
    removeMessage(
        _id: ID!
    ): Message
`;
