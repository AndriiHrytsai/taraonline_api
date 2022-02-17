'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.productSorts = gql`
    productSorts(
    page: Int!
    pageSize: Int
    sort: String
    search: String
    searchFields: String
    ): ProductSortList
`;
