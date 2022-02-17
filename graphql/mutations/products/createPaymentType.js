'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.createPaymentType = gql`
    createPaymentType(name: String, value: String): PaymentType
`;
