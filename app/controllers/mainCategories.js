/**
 * Author: VincentBel
 * Date: 16/3/23
 */

'use strict'

const mongoose = require('mongoose')
const MainCategory = mongoose.model('MainCategory')
const ConflictError = require('../errors/ConflictError')

// create a new main category
exports.create = (req, res, next) => {
  const name = req.body.name
  MainCategory.findByName(name)
    .then(category => {
      if (category) {
        throw new ConflictError(`一级菜单: ${name} 已存在`)
      }
      return new MainCategory({ name }).save()
    })
    .then(category => {
      res.status(201).fjson(category.toObject())
    })
    .catch(next)
}
