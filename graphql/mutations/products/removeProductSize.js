'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.removeProductSize = gql`
    removeProductSize(
    _id: ID!
    ): ProductSize
`;
