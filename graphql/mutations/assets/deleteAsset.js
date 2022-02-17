'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.deleteAsset = gql`
    deleteAsset(
        _id: ID!
    ): Asset
`;
