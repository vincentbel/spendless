/**
 * Author: VincentBel
 * Date: 15/10/27
 */

'use strict'

const config = require('../../config/config')
const UnauthorizedError = require('../errors/UnauthorizedError')
const ForbiddenError = require('../errors/ForbiddenError')

function requireAuth(req, res, next) {
  // check header or url parameters or post parameters for token
  const token = req.body.token || req.query.token || req.headers['x-access-token']

  // decode token
  if (token) {
    const jwt = require('jsonwebtoken')

    // verifies secret and checks exp
    jwt.verify(token, config.jwtSecretKey, (err, decoded) => {
      if (err) {
        // Todo may need to check JsonWebTokenError, TokenExpiredError
        return res.fjsone(new UnauthorizedError('Failed to authenticate token.'))
      }
      // if everything is good, save to request for use in other routes
      req.user = decoded // eslint-disable-line no-param-reassign
      return next()
    })
  } else {
    // if there is no token
    // return an error
    next(new UnauthorizedError('No token provided.'))
  }
}

exports.requireAuth = requireAuth

exports.requireAdmin = (request, response, next) => requireAuth(request, response, (req, res) => {
  if (!req.user || !req.user.admin) {
    return res.fjsone(new ForbiddenError('Permission deny.'))
  }
  return next()
})
