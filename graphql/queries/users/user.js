'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.user = gql`
    user(
    _id: ID
    ): User
`;
