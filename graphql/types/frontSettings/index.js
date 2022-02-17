'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.FrontSettings = gql`
    type FrontSettings  {
        enabledRegistration: Boolean
        enabledLogin: Boolean 
        modifiedAt: Date
        createdBy: User
    }
    
    input FrontSettingsUpdateInput {
        enabledRegistration: Boolean
        enabledLogin: Boolean
    }
`;
