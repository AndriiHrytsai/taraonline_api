'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.updateFrontSettings = gql`
    updateFrontSettings(
        data: FrontSettingsUpdateInput!
    ): FrontSettings
`;
