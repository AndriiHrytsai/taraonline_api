'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.message = gql`
    message(
    _id: ID!
    ): Message
`;
