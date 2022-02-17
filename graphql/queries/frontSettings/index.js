'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.frontSettings = gql`
    frontSettings(
        all: Boolean
    ): FrontSettings
`;
