'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.productBrands = gql`
    productBrands(
    page: Int!
    pageSize: Int
    sort: String
    search: String
    searchFields: String
    ): ProductBrandList
`;
