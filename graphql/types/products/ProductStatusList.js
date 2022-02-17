'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.ProductStatusList = gql`
	type ProductStatusList  {
		rows: [ProductStatus]
		total: Int
		page: Int
		pageSize: Int
		totalPages: Int
	}
`;
