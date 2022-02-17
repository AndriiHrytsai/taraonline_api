'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.uploadAsset = gql`
    uploadAsset(
      file: Upload!,
      itemId: ID
    ): Asset
`;
