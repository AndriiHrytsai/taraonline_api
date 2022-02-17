'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.updatePaymentType = gql`
    updatePaymentType(_id: ID, name: String, value: String): PaymentType
`;
