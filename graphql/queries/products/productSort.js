'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.productSort = gql`
    productSort(
    _id: ID
    value: String
    ): ProductSort
`;
