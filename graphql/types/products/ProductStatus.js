'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.ProductStatus = gql`
	type ProductStatus {
		_id: ID!
		name: String
		value: String
		createdAt: Date
		createdBy: String
		modifiedAt: Date
		modifiedBy: String
		isDeleted: Boolean
	}
`;
