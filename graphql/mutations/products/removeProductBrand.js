'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.removeProductBrand= gql`
    removeProductBrand(
    _id: ID!
    ): ProductBrand
`;
