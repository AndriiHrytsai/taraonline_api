'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.PaymentTypeList = gql`
	type PaymentTypeList  {
		rows: [PaymentType]
		total: Int
		page: Int
		pageSize: Int
		totalPages: Int
	}
`;
