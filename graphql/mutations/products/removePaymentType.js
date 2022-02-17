'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.removePaymentType = gql`
    removePaymentType(
    _id: ID!
    ): PaymentType
`;
