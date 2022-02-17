'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.asset = gql`
    asset(
        itemId: ID
    ): Asset
`;
