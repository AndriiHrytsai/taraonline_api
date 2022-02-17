'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.removeProductType = gql`
    removeProductType(
    _id: ID!
    ): ProductType
`;
