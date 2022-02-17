'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.Warehouse = gql`
    type Warehouse {
        _id: ID!
        name: String
        placeId: String
        houseNumber: String
        streetName: String
        createdAt: Date
        createdBy: String
        updatedAt: Date
        updatedBy: String
        isDeleted: Boolean
    }
    
    input WarehouseInput {
        name: String!
        placeId: String!
        houseNumber: String!
        streetName: String!
    }
    
    input WarehouseUpdateInput {
        name: String!
        placeId: String!
        houseNumber: String!
        streetName: String!
    }
`;
