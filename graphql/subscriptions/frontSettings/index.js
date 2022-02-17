'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.frontSettingsUpdated = gql`
    type Subscription {
        frontSettingsUpdated(all: Boolean): FrontSettings
    }
`;
