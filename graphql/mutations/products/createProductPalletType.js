'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.createProductPalletType = gql`
    createProductPalletType(name: String!, value: String!): ProductPalletType
`;
