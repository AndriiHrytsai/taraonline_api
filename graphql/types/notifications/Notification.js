'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.Notification = gql`
    type Notification {
        _id: ID!
        userId: User
        title: String
        message: String
        seen: Boolean
        createdAt: Date
        updatedAt: Date
    }

    input NotificationInput {
        userId: ID!
        title: String!
        message: String!
    }
`;
