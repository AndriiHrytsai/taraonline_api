'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.createRanking = gql`
    createRanking(data: RankingInput): Ranking
`;
