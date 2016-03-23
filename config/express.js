'use strict'

const logger = require('morgan')
const bodyParser = require('body-parser')
const compress = require('compression')
const methodOverride = require('method-override')

module.exports = function (app, config) {
  const env = process.env.NODE_ENV || 'development'
  app.locals.ENV = env // eslint-disable-line no-param-reassign
  app.locals.ENV_DEVELOPMENT = env === 'development' // eslint-disable-line no-param-reassign

  app.use(logger('dev'))
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({
    extended: true,
  }))
  app.use(compress())
  app.use(methodOverride())

  // routes
  require(`${config.root}/app/routes/index`)(app, config)
}
