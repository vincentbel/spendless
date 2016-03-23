'use strict'

const HttpError = require('./HttpError')

class UnprocessableEntityError extends HttpError {
  /**
   * UnprocessableEntityError constructor
   *
   * @param {String} message Error message
   * @constructor
   */
  constructor(message) {
    super(message, 422)
  }
}

/*!
 * Module exports.
 */
module.exports = exports = UnprocessableEntityError
