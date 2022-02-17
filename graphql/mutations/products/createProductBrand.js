'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.createProductBrand = gql`
    createProductBrand(name: String!, value: String!): ProductBrand
`;
