'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.productTypes = gql`
    productTypes(
        page: Int!
        pageSize: Int
        sort: String
        search: String
        searchFields: String
    ): ProductTypeList
`;
