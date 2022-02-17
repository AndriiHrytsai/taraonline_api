'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.betaUser = gql`
    betaUser(
        email: String
    ): Boolean
`;
