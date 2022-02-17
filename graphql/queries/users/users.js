'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.users = gql`
    users(
    userId: ID
    location: String
    username: String
    createdAt: DateInput
    modifiedAt: DateInput
    page: Int!
    pageSize: Int
    sort: SortInput
    onlyActive: Boolean
    role: Role
    ): UserList
`;
