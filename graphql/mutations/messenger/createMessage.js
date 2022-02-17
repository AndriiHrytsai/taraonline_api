'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.createMessage = gql`
    createMessage(data: MessageInput): Message
`;
