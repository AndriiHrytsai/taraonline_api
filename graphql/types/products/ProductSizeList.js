'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.ProductSizeList = gql`
    type ProductSizeList  {
        rows: [ProductSize]
        total: Int
        page: Int
        pageSize: Int
        totalPages: Int
    }
`;
