'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.removeProductLoad = gql`
    removeProductLoad(
    _id: ID!
    ): ProductLoad
`;
