'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.productType = gql`
    productType(
        _id: ID
        value: String
    ): ProductType
`;
