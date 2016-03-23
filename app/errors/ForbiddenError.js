'use strict'

const HttpError = require('./HttpError')

class ForbiddenError extends HttpError {
  /**
   * ForbiddenError constructor
   *
   * @param {String} message Error message
   * @constructor
   */
  constructor(message) {
    super(message, 403)
  }
}

/*!
 * Module exports.
 */
module.exports = exports = ForbiddenError

