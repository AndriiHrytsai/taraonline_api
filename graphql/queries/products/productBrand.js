'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.productBrand = gql`
    productBrand(
    _id: ID
    value: String
    ): ProductBrandList
`;
