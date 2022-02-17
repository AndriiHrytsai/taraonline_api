'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.productPalletTypes = gql`
    productPalletTypes(
    page: Int!
    pageSize: Int
    sort: String
    search: String
    searchFields: String
    ): ProductPalletTypeList
`;
