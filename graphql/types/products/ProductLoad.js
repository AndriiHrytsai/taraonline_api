'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.ProductLoad = gql`
    type ProductLoad {
        _id: ID!
        name: String
        value: String
        index: Int
        highlight: Boolean
        createdAt: Date
        createdBy: String
        modifiedAt: Date
        modifiedBy: String
        isDeleted: Boolean
    }
`;
