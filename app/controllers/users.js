'use strict'

const mongoose = require('mongoose')
const User = mongoose.model('User')

// create a new user
exports.create = (req, res, next) => {
  // Todo
  res.fjson({ very: 'good' })
}
