'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.delivery = gql`
    delivery(
    _id: ID
    ): Delivery
`;
