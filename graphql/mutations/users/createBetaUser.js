'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.createBetaUser = gql`
    createBetaUser(
        email: String
    ): BetaUser
`;
