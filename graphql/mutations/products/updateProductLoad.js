'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.updateProductLoad = gql`
    updateProductLoad(_id: ID, name: String, value: String, index: Int, highlight: Boolean): ProductLoad
`;
