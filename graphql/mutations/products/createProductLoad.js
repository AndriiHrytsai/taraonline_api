'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.createProductLoad = gql`
    createProductLoad(name: String!, value: String!, index: Int!, highlight: Boolean!): ProductLoad
`;
