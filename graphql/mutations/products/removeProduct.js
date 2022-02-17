'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.removeProduct = gql`
    removeProduct(
    _id: ID!
    ): Product
`;
