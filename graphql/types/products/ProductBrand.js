'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.ProductBrand = gql`
    type ProductBrand {
        _id: ID!
        name: String
        value: String
        createdAt: Date
        createdBy: String
        modifiedAt: Date
        modifiedBy: String
        isDeleted: Boolean
    }
`;
