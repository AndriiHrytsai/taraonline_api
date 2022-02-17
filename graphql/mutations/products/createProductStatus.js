'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.createProductStatus = gql`
    createProductStatus(name: String, value: String): ProductStatus
`;
