'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.productOptions = gql`
    productOptions(
    page: Int!
    pageSize: Int
    sort: String
    search: String
    searchFields: String
    ): ProductOptionsList
`;
