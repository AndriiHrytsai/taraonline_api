"use strict";

const { moleculerGql: gql } = require("moleculer-apollo-server");

exports.CreateUserResponse = gql`
	type CreateUserResponse {
		accessToken: String!
		currentUser: User
	}
`;
