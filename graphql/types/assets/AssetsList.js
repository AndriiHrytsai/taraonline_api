'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.AssetsList = gql`
    type AssetsList {
        rows: [Asset]
        total: Int
        page: Int
        pageSize: Int
        totalPages: Int
    }
`;
