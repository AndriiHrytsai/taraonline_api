'use strict';

const { moleculerGql: gql } = require('moleculer-apollo-server');

exports.ProductTypeList = gql`
	type ProductTypeList  {
		rows: [ProductType]
		total: Int
		page: Int
		pageSize: Int
		totalPages: Int
	}
`;
