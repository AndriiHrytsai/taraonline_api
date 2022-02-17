'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.deactivateProduct = gql`
    deactivateProduct(
    _id: ID!
    ): Product
`;
