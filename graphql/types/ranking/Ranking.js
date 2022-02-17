'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.Ranking = gql`
    type Ranking {
        _id: ID!
        userId: ID
        votedUserId: ID
        itemId: ID
        rating: Int
        createdAt: Date
    }

    input RankingInput {
        userId: ID!
        votedUserId: ID!
        itemId: ID!
        rating: Int!
    }
`;