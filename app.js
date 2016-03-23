'use strict'

const express = require('express')
const config = require('./config/config')
const mongoose = require('mongoose')
const fs = require('fs')
const Promise = require('bluebird')
global.Promise = Promise
const join = require('path').join

// NOTE: event name is camelCase as per node convention
process.on('unhandledRejection', (reason) => {
  throw reason
})

const app = express()
const models = join(__dirname, 'app/models')
const port = process.env.PORT || config.port || 3000

// Bootstrap models
fs.readdirSync(models)
  .filter(file => ~file.indexOf('.js'))
  .forEach(file => require(join(models, file)))

require('./config/express')(app, config)

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose default connection disconnected through app termination')
    process.exit(0)
  })
})

function listen() {
  if (app.get('env') === 'test') return
  app.listen(port)
  console.log(`Express app started on port ${port}`)
}

function init() {
  // After connected, use bluebird as mongoose promise
  mongoose.Promise = Promise
}

function connect() {
  const options = { server: { socketOptions: { keepAlive: 1 } } }
  return mongoose.connect(config.db, options).connection
}

// MongoDB connect
connect()
  .on('error', console.log)
  .on('connected', init)
  .on('disconnected', connect)
  .once('open', listen)

module.exports = app
