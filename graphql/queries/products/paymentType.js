'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.paymentType = gql`
    paymentType(
        _id: ID
        value: String
    ): PaymentType
`;
