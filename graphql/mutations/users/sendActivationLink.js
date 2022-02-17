'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.sendActivationLink = gql`
    sendActivationLink(email: String!): Status
`;
