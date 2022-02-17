'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.productStatus = gql`
    productStatus(
        _id: ID
        value: String
    ): ProductStatus
`;
