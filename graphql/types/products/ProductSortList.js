'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.ProductSortList = gql`
    type ProductSortList  {
        rows: [ProductSort]
        total: Int
        page: Int
        pageSize: Int
        totalPages: Int
    }
`;
