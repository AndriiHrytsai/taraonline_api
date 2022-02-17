'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.createProductType = gql`
    createProductType(data: ProductTypeInput): ProductType
`;
