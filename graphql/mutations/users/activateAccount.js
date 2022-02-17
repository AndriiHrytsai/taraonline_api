'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.activateAccount = gql`
    activateAccount(resetToken: String!): Status
`;
