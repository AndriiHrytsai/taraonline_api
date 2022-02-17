'use strict';

const {moleculerGql: gql} = require('moleculer-apollo-server');

exports.productDeleted = gql`
    type Subscription {
        productDeleted(_id: ID): Product
    }
`;
