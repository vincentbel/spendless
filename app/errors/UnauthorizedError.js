'use strict'

const HttpError = require('./HttpError')

class UnauthorizedError extends HttpError {
  /**
   * UnauthorizedError constructor
   *
   * @param {String} message Error message
   * @constructor
   */
  constructor(message) {
    super(message, 401)
  }
}

/*!
 * Module exports.
 */
module.exports = exports = UnauthorizedError
