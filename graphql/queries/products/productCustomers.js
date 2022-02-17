'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.productCustomers = gql`
    productCustomers(
    ownerId: ID
    customerId: ID
    sort: SortInput
    productId: ID
    page: Int!
    pageSize: Int
    count: Int
    city: String
    createdAt: DateInput
    updatedAt: DateInput
    price:Float
    isApproved: Boolean
    isFinished: Boolean
    isDeleted: Boolean
    isOwnerTransport: Boolean
    ownerAndCustomer: ID
    orderStatus: Boolean
    ownerIds: [ID]
    customerIds: [ID]
    ): ProductCustomerList
`;
