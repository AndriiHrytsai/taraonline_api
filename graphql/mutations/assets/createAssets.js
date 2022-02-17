'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.createAssets = gql`
    createAssets(data: AssetInput!, files: [Upload!]!): [Asset!]!
`;
