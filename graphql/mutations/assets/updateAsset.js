'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.updateAsset = gql`
  updateAsset(_id: ID!, data: AssetInput): Asset
`;
