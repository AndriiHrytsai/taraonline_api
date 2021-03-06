'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.productLoads = gql`
    productLoads(
    page: Int!
    pageSize: Int
    sort: String
    search: String
    searchFields: String
    ): ProductLoadList
`;
