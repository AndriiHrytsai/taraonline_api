'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.removeProductPalletType = gql`
    removeProductPalletType(
    _id: ID!
    ): ProductPalletType
`;
