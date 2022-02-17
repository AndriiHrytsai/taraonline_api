'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.productSizes = gql`
    productSizes(
    page: Int!
    pageSize: Int
    sort: String
    search: String
    searchFields: String
    ): ProductSizeList
`;
