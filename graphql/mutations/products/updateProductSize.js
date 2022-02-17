'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.updateProductSize = gql`
    updateProductSize(_id: ID, name: String, value: String): ProductSize
`;
