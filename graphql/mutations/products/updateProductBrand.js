'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.updateProductBrand = gql`
    updateProductBrand(_id: ID, name: String, value: String): ProductBrand
`;
