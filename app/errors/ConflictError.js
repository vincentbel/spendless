'use strict'

const HttpError = require('./HttpError')

class ConflictError extends HttpError {
  /**
   * ConflictError constructor
   *
   * @param {String} message Error message
   * @constructor
   */
  constructor(message) {
    super(message, 409)
  }
}

/*!
 * Module exports.
 */
module.exports = exports = ConflictError
