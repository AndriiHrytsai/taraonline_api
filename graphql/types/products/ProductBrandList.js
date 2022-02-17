'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.ProductBrandList = gql`
    type ProductBrandList  {
        rows: [ProductBrand]
        total: Int
        page: Int
        pageSize: Int
        totalPages: Int
    }
`;
