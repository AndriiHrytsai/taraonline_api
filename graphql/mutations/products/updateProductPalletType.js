'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.updateProductPalletType = gql`
    updateProductPalletType(_id: ID, name: String, value: String): ProductPalletType
`;
