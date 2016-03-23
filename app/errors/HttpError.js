'use strict'

/**
 * HttpError class
 */
class HttpError extends Error {

  /**
   * HttpError constructor
   *
   * @param {String} message Error message
   * @param {Number} statusCode Http status code
   * @constructor
   */
  constructor(message, statusCode) {
    super(message)
    this.name = this.constructor.name
    this.message = message
    this.statusCode = statusCode
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor)
    } else {
      this.stack = (new Error(message)).stack
    }
  }
}

/*!
 * Module exports.
 */
module.exports = exports = HttpError
