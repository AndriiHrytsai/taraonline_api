'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.ProductLoadList = gql`
    type ProductLoadList  {
        rows: [ProductLoad]
        total: Int
        page: Int
        pageSize: Int
        totalPages: Int
    }
`;
