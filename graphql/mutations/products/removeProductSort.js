'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.removeProductSort = gql`
    removeProductSort(
    _id: ID!
    ): ProductSort
`;
