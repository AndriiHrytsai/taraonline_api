'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.productStatuses = gql`
    productStatuses(
        page: Int!
        pageSize: Int
        sort: String
        search: String
        searchFields: String
    ): ProductStatusList
`;
