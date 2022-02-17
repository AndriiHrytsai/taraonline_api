'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.updateProductType = gql`
    updateProductType(data: ProductTypeUpdateInput): ProductType
`;
