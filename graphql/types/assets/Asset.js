'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.Asset = gql`
    type Asset {
        _id: ID!
        itemId: ID!
        assetUrl: String!
        mimetype: String
        filesize: Int
        filename: String
        userId: User
        createdAt: Date
        updatedAt: Date
    }

    input AssetInput {
        model: String!
        itemId: ID!
    }

`;
