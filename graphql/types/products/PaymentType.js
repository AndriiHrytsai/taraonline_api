'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.PaymentType = gql`
	type PaymentType {
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
