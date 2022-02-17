'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.createManyBetaUser = gql`
    createManyBetaUser(
        emails: [String]
    ): [BetaUser]
`;
