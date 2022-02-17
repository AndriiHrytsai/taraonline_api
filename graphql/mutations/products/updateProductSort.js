'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.updateProductSort = gql`
    updateProductSort(_id: ID, name: String, value: String): ProductSort
`;
