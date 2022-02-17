'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.removeProductStatus = gql`
    removeProductStatus(
    _id: ID!
    ): ProductStatus
`;
