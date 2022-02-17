'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.resetPassword = gql`
    resetPassword(resetToken: String!, password: String): Status
`;
