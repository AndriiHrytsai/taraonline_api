"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.ProductList = gql`
	input DateInput {
		from: Date
		to: Date
	}

	input PriceInput {
		from: Float
		to: Float
	}

	input SortInput {
		value: String
		field: String
	}
	
	type ProductList {
		rows: [Product]
		total: Int
		page: Int
		pageSize: Int
		totalPages: Int
	}
`;
