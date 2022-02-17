'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.deleteAssetList = gql`
    deleteAssetList(
    listId: [ID]!
    ): AssetsList
`;
