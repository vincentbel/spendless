/**
 * Author: VincentBel
 * Date: 16/3/23
 */

'use strict'

const Promise = require('bluebird')
const mongoose = require('mongoose')
const MainCategory = mongoose.model('MainCategory')
const SubCategory = mongoose.model('SubCategory')
const UnprocessableEntityError = require('../errors/UnprocessableEntityError')
const ConflictError = require('../errors/ConflictError')

function checkObjectId(objectId, errorMessage) {
  return mongoose.Types.ObjectId.isValid(objectId) ?
    Promise.resolve(objectId) :
    Promise.reject(new UnprocessableEntityError(errorMessage))
}

// create a new main category
exports.createMain = (req, res, next) => {
  const name = req.body.name
  MainCategory.findByName(name)
    .then(category => {
      if (category) {
        throw new ConflictError(`一级类别: ${name} 已存在`)
      }
      return new MainCategory({ name }).save()
    })
    .then(category => {
      res.status(201).fjson(category.toClient())
    })
    .catch(next)
}

// create a new sub category
exports.createSub = (req, res, next) => {
  const name = req.body.name
  const mainCategoryId = req.params.mainCategoryId

  checkObjectId(mainCategoryId, '一级类别id有误')
    .then(MainCategory.findById.bind(MainCategory))
    .then(mainCategory => {
      if (!mainCategory) {
        throw new UnprocessableEntityError('一级类别id不存在')
      }
      return mainCategory
    })
    .then(mainCategory => {
      const subCategory = SubCategory.findByName(name)
        .then(category => {
          if (category) {
            throw new ConflictError(`二级类别: ${name} 已存在`)
          }
          return new SubCategory({ name }).save()
        })
      return [mainCategory, subCategory]
    })
    .spread((mainCategory, subCategory) => {
      // 通过前面可知当前 subCategory 是新建的,所以不可能在 mainCategory.subCategories 中存在
      mainCategory.subCategories.push(subCategory._id)
      return [mainCategory.save(), subCategory]
    })
    .spread((mainCategory, subCategory) => {
      res.status(201).fjson(Object.assign({}, subCategory.toClient(), {
        mainCategory: {
          id: mainCategory._id,
          name: mainCategory.name,
        },
      }))
    })
    .catch(next)
}

// list of populated categories
exports.list = (req, res, next) => {
  return MainCategory.list({})
    .then(categories => {
      res.fjson({
        itemCount: categories.length,
        items: categories.map(category => Object.assign({}, category.toClient(), {
          subCategories: category.subCategories.map(sub => sub.toClient()),
        })),
      })
    })
    .catch(next)
}
