'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.createProductSort = gql`
    createProductSort(name: String!, value: String!): ProductSort
`;
