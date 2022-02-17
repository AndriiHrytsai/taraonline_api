'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.changePassword = gql`
    changePassword(
    prevPassword: String!,
    newPassword: String!
    ): UserResponse
`;
