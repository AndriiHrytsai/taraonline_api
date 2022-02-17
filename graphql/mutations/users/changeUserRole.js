'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.changeUserRole = gql`
    changeUserRole(
    userId: ID!,
    role: Role!
    ): UserResponse
`;
