"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.UserList = gql`
	type UserList {
		rows: [User]
		total: Int
		page: Int
		pageSize: Int
		totalPages: Int
	}
`;
