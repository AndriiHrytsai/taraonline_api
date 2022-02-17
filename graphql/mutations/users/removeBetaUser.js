'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.removeBetaUser = gql`
    removeBetaUser(
        email: String
    ): Boolean
`;
