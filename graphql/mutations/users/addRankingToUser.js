'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.addRankingToUser = gql`
    addRankingToUser(data: RankingInput): User
`;
