'use strict'

const path = require('path')
const rootPath = path.normalize(`${__dirname}/..`)
const jwtSecretKey = 'secret'
const env = process.env.NODE_ENV || 'development'

const common = {
  apiVersion: 1.0,
  root: rootPath,
  jwtSecretKey,
  app: {
    name: 'APP_NAME',
  },
}

const config = {
  development: {
    port: 3000,
    db: 'mongodb://localhost/APP_NAME-development',
  },

  test: {
    port: 3000,
    db: 'mongodb://localhost/APP_NAME-test',
  },

  production: {
    port: 3000,
    db: 'mongodb://localhost/APP_NAME-production',
  },
}

module.exports = Object.assign({}, common, config[env])
