'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.paymentTypes = gql`
    paymentTypes(
        page: Int!
        pageSize: Int
        sort: String
        search: String
        searchFields: String
    ): PaymentTypeList
`;
