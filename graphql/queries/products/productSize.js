'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.productSize = gql`
    productSize(
    _id: ID
    value: String
    ): ProductSize
`;
