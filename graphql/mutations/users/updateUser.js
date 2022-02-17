'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.updateUser = gql`
    updateUser(
    _id: ID!,
    data: UpdateUserInput,
    file: Upload
    ): UserResponse
`;
