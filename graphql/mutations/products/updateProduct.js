'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.updateProduct = gql`
    updateProduct(_id: ID!, data: ProductUpdateInput!, removeAssetList: [ID]): Product!
`;
