'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.ranking = gql`
    ranking(
    userId: ID!
    ): Int
`;
