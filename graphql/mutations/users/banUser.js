'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.banUser = gql`
    banUser(
    userId: ID!,
    banExpiration: Date!
    ): UserResponse
`;
