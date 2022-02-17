'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.login = gql`
    login(email: String!, password: String!): LoginResponse
`;
