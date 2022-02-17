'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.ProductPalletTypeList = gql`
    type ProductPalletTypeList  {
        rows: [ProductPalletType]
        total: Int
        page: Int
        pageSize: Int
        totalPages: Int
    }
`;
