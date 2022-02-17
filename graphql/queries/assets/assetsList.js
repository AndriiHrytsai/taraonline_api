'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.assetsList = gql`
    assetsList(
        page: Int=1
        pageSize: Int=10
        sort: String
        itemId: ID
    ): AssetsList
`;
