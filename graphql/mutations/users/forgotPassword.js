'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.forgotPassword = gql`
    forgotPassword(email: String!): Status
`;
