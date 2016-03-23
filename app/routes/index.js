'use strict'

const users = require('./users')
const formatJsonResponse = require('../middleware/formatJsonResponse')
const NotFoundError = require('../errors/NotFoundError')
const UnprocessableEntityError = require('../errors/UnprocessableEntityError')
const CastError = require('mongoose/lib/error/cast')
const ValidationError = require('mongoose/lib/error/validation')

module.exports = function routes(app) {
  app.use(formatJsonResponse)

  // allow CORS
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    res.header('Access-Control-Allow-Headers',
      'Accept,Content-Type,Keep-Alive,User-Agent,Cache-Control,x-access-token'
    )

    if (req.method === 'OPTIONS') {
      res.sendStatus(200)
    } else {
      next()
    }
  })

  app.get('/', (req, res) => {
    res.fjson({ you: 'are welcome!' })
  })

  app.use('/users', users)

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    next(new NotFoundError('Not Found'))
  })

  // error handlers
  // Warn: need four parameters! the unused next param is necessary
  app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    let responseToClientError
    if (err instanceof CastError) { // mongoose CaseError 说明参数不正确
      responseToClientError = new UnprocessableEntityError('参数格式不正确')
    } else if (err instanceof ValidationError) {  // mongoose ValidationError 说明验证出错
      responseToClientError = new UnprocessableEntityError('验证错误')
      responseToClientError.errors = err.errors
    } else {
      responseToClientError = err
    }

    res.fjsone(responseToClientError)

    if (!err.statusCode || err.statusCode === 500) {
      console.error(err.stack)
      // Todo email the error to developers
    }
  })
}
