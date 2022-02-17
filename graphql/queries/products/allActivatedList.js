'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.allActivatedList = gql`
    allActivatedList(
        isActivated: Boolean
    ): ProductList
`;
