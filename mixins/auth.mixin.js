'use strict';

const ApiGateway = require('moleculer-web');
const {MoleculerClientError} = require('moleculer').Errors;
const {UnAuthorizedError} = ApiGateway.Errors;
const gql = require('graphql-tag');

const ERR_NO_TOKEN = 'NO_TOKEN';
const ERR_INVALID_TOKEN = 'INVALID_TOKEN';
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
  methods: {
    /**
     * Authenticate the request. It check the `Authorization` token value in the request header.
     * Check the token value & resolve the users by the token.
     * The resolved users will be available in `ctx.meta.users`
     *
     * @param {Context} ctx
     * @param {Object} route
     * @param {IncomingRequest} req
     * @returns {Promise}
     */
    async authenticate(ctx, route, req) {
      // pass authentication on login and refreshToken actions
      const obj = req.body && req.body.query && gql`
          ${req.body.query}
      `;

      const accessSelectionsNames = ['login', 'refreshToken', 'forgotPassword', 'resetPassword', 'sendActivationLink', 'activateAccount', 'logout', 'createUser', 'createBetaUser', 'createManyBetaUser', 'frontSettings']
      if (obj && accessSelectionsNames.includes(obj.definitions[0].selectionSet.selections[0].name.value)) {
        return null;
      }

      // Read the token from header
      let token;

      if (req.headers.authorization) {
        const type = req.headers.authorization.split(' ')[0];
        if (type === 'Token' || type === 'Bearer') {
          token = req.headers.authorization.split(' ')[1];
        }
      }
      if (!token) {
        return Promise.reject(new UnAuthorizedError(ERR_NO_TOKEN));
      }

      // Verify JWT token
      const user = await ctx.call('auth.resolveToken', {token});

      if (!user._id) {
        return Promise.reject(new UnAuthorizedError(ERR_INVALID_TOKEN));
      }

      return ctx.meta.user = user;
    },
    checkUserRole(ctx) {
      if (ctx.action?.role?.length > 0 && !ctx.action.role.includes(ctx.meta.user.role))
        throw new MoleculerClientError('User not have permission for this action!', 403, 'FORBIDDEN');

    },
  },

  /**
   * Authorize the request. Check that the authenticated user has right to access the resource.
   *
   * @param {Context} ctx
   * @param {Object} route
   * @param {IncomingRequest} req
   * @returns {Promise}
   */
  async authorize(ctx, route, req) {
    // Read the token from header
    let token;

    if (req.headers.authorization) {
      const type = req.headers.authorization.split(' ')[0];
      if (type === 'Token' || type === 'Bearer') {
        token = req.headers.authorization.split(' ')[1];
      }
    }

    if (!token) {
      return Promise.reject(new UnAuthorizedError(ERR_NO_TOKEN));
    }

    // Verify JWT token
    const user = await ctx.call('auth.resolveToken', {token});

    if (!user._id) {
      return Promise.reject(new UnAuthorizedError(ERR_INVALID_TOKEN));
    }

    return ctx.meta.user = user;
  }
}

