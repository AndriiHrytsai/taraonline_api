'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.productLoad = gql`
    productLoad(
    _id: ID
    value: String
    ): ProductLoad
`;
