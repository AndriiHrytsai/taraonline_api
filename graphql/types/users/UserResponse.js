const {moleculerGql: gql} = require("moleculer-apollo-server");
exports.UserResponse = gql`
    type UserResponse {
        _id: ID!
        username: String
        email: String
        phones: [String]
        birthdayDate: Date
        role: Role
        banned: Boolean
        banExpiration: Date
        gender: String
        location: City
        houseNumber: String
        emailVerified: Boolean
        streetName: String
        ranking: Int
        avatar: Asset
        description: DescriptionType
        createdAt: Date
        modifiedAt: Date
        lastLoginAt: Date
    }
`