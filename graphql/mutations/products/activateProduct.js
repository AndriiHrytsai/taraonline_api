'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.activateProduct = gql`
    activateProduct(
    _id: ID!
    ): Product
`;
