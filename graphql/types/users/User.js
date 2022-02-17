'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.User = gql`
    type User {
        _id: ID!
        username: String
        email: String
        phones: [String]
        birthdayDate: Date
        gender: String
        password: String
        location: City
        counts:Counts
        emailVerified: Boolean
        warehouses: [Warehouse]
        houseNumber: String
        streetName: String
        role: Role
        banned: Boolean
        banExpiration: Date
        ranking: Int
        googleId: String
        googleAccessToken: String
        avatar: Asset
        description: DescriptionType
        createdAt: Date
        modifiedAt: Date
        isDeleted: Boolean
        lastLoginAt: Date
    }

    input UpdateUserInput {
        username: String
        email: String
        phones: [String]
        houseNumber: String
        streetName: String
        birthdayDate: Date
        gender: String
        location: CityInput
        description: DescriptionInput
        emailVerified: Boolean
    }

    enum Role {
        user
        moderator
        admin
    }

    type Counts {
        activatedProducts:Int
        deactivatedProducts:Int
        customerProducts:Int
    }

    type Status {
        status: String
    }

    input DescriptionInput {
        userDesc: String
        companyDesc: String
    }

    type DescriptionType {
        userDesc: String
        companyDesc: String
    }
`;

