'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.uploadImage = gql`
    uploadImage(_id: ID, image: String): Boolean
`;
