'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.BetaUser = gql`
    type BetaUser {
        email: String!
    }
`;
