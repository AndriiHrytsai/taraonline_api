'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.createUser = gql`
    createUser(
        email: String!,
        username: String!,
        password: String!,
    ): CreateUserResponse  
`;
