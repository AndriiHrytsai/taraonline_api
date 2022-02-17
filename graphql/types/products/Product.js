'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.Product = gql`
    type City {
        name:String
        placeId:String
    }

    input CityInput {
        name:String!
        placeId:String!
    }

    type Product {
        _id:ID!,
        userId:User,
        title:String,
        assets:[Asset],
        description:String,
        count:Int,
        minCount:Int,
        maxCount:Int,
        productStatus:ProductStatus,
        productType:ProductType,
        paymentType:PaymentType,
        productSize:ProductSize,
        productLoad:ProductLoad,
        productSort:ProductSort,
        productPalletType: ProductPalletType,
        productBrands: [ProductBrand],
        customLoad:String
        customSort:String
        customSize:String
        customPalletType:String
        isBuy:Boolean,
        isNew:Boolean,
        isTax:Boolean,
        isCertificate:Boolean,
        canVote:Boolean,
        city:City,
        houseNumber:String,
        streetName:String,
        price:Float,
        createdAt:Date,
        createdBy:String,
        updatedAt:Date,
        updatedBy:String,
        isDeleted:Boolean,
        isActivated:Boolean,
        conversationId:Conversation
    }

    input ProductInput {
        userId: ID!
        title:String
        description:String
        count:Int
        minCount:Int!
        maxCount:Int!
        productStatus:ID
        productType:ID!
        paymentType:ID!
        productSize:ID
        productLoad:ID
        productSort:ID
        productPalletType: ID,
        productBrands: [ID],
        customLoad:String
        customSort:String
        customSize:String
        customPalletType:String
        isBuy:Boolean!
        isNew:Boolean
        isTax:Boolean
        isCertificate:Boolean
        city:CityInput!
        houseNumber:String!
        streetName:String!
        price:Float!
    }

    input ProductUpdateInput {
        title:String
        description:String
        count:Int
        minCount:Int
        maxCount:Int
        productStatus:ID
        productType:ID
        paymentType:ID
        productSize:ID
        productLoad:ID
        productSort:ID
        productPalletType: ID,
        productBrands: [ID],
        customLoad:String
        customSort:String
        customSize:String
        customPalletType:String
        phone:String
        email:String
        isBuy:Boolean
        isNew:Boolean
        isTax:Boolean
        isCertificate:Boolean
        city:CityInput
        houseNumber:String
        streetName:String
        price:Float
    }
`;
