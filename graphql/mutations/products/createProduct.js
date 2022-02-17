'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.createProduct = gql`
    createProduct(data: ProductInput): Product
`;
