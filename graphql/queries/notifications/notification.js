'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.notification = gql`
    notification(
    _id: ID!
    ): Notification!
`;
