'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.updateProductStatus = gql`
    updateProductStatus(_id: ID, name: String, value: String): ProductStatus
`;
