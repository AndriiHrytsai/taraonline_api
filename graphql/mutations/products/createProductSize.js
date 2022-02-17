'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.createProductSize = gql`
    createProductSize(name: String!, value: String!): ProductSize
`;
