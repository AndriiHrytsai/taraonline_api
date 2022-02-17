'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.ProductType = gql`
    type ProductType {
        _id: ID!
        name: String
        value: String
        productSort: [ProductSort]
        productSize: [ProductSize]
        productLoad: [ProductLoad]
        isCustomSize: Boolean
        isCustomSort: Boolean
        isCustomLoad: Boolean
        isPalletType: Boolean
        isBrand: Boolean
        isCertificate: Boolean
        isHeight: Boolean
        isWidth: Boolean
        isLength: Boolean
        createdAt: Date
        createdBy: String
        modifiedAt: Date
        modifiedBy: String
        isDeleted: Boolean
    }

    input ProductTypeInput {
        name: String
        value: String
        productSort: [ID]
        productSize: [ID]
        productLoad: [ID]
        isCustomSize: Boolean
        isCustomSort: Boolean
        isCustomLoad: Boolean
        isPalletType: Boolean
        isBrand: Boolean
        isCertificate: Boolean
        isHeight: Boolean
        isWidth: Boolean
        isLength: Boolean
    }

    input ProductTypeUpdateInput {
        _id: ID!
        name: String
        value: String
        productSort: [ID]
        productSize: [ID]
        productLoad: [ID]
        isCustomSize: Boolean
        isCustomSort: Boolean
        isCustomLoad: Boolean
        isPalletType: Boolean
        isBrand: Boolean
        isCertificate: Boolean
        isHeight: Boolean
        isWidth: Boolean
        isLength: Boolean
    }

`;
