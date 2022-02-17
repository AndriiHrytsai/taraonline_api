'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.products = gql`
    products(
    title: String
    userId: ID
    userIds: [ID]
    city: String
    username: String
    minCount: Int
    maxCount: Int
    createdAt: DateInput
    updatedAt: DateInput
    isTax: Boolean
    isBuy: Boolean
    price: PriceInput
    sort: SortInput
    page: Int!
    pageSize: Int
    customSize: Boolean
    customSort: Boolean
    customLoad: Boolean
    isActivate: Boolean
    productTypes: [ID]
    productLoads: [ID]
    productSorts: [ID]
    productSizes: [ID]
    productPalletTypes: [ID]
    productBrands: [ID]
    customPalletType: Boolean
    isCertificate: Boolean
    ): ProductList
`;
