'use strict'

const HttpError = require('./HttpError')

class NotFoundError extends HttpError {
  /**
   * NotFoundError constructor
   *
   * @param {String} message Error message
   * @constructor
   */
  constructor(message) {
    super(message, 404)
  }
}

/*!
 * Module exports.
 */
module.exports = exports = NotFoundError
