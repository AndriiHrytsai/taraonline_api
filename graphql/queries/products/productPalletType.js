'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.productPalletType = gql`
    productPalletType(
    _id: ID
    value: String
    ): ProductPalletType
`;
