const jwt = require('jsonwebtoken');
const {MoleculerRetryableError, MoleculerClientError} = require('moleculer').Errors;

/**
 * Generate a JWT token from users entity.
 *
 * @param {Object} payload
 * @param {String|Number} [expiresIn]
 * Expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms.js).
 * Eg: 60, "2 days", "10h", "7d"
 */
exports.generateJWT = async (user, expiresIn) => {
  const payload = {id: user._id.toString()};

  return new Promise((resolve, reject) => {
    const jwtExpiresIn = expiresIn || '1d';
    return jwt.sign(payload, process.env.JWT_KEY, {expiresIn: jwtExpiresIn}, (err, token) => {
      if (err) {
        this.logger.warn('JWT token generation error:', err);
        return reject(new MoleculerRetryableError('Unable to generate token', 500, 'UNABLE_GENERATE_TOKEN'));
      }

      resolve('Bearer ' + token);
    });
  });
}

exports.verifyJWT = async (token) => new Promise((resolve, reject) => {
  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      return reject(new MoleculerClientError('Invalid token', 401, 'INVALID_TOKEN'));
    }
    resolve(decoded);
  });
})
