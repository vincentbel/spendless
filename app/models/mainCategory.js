/**
 * Author: VincentBel
 * Date: 16/3/23
 */

'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema


/**
 * MainCategory Schema
 */
const MainCategorySchema = new Schema({
  name: { type: String },
  user: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  subCategories: [{ type: Schema.Types.ObjectId, ref: 'SubCategory' }],
  createdAt: { type: Date },
  updatedAt: { type: Date },
})

/**
 * pre
 */
MainCategorySchema.pre('save', function updateCreatedAndUpdatedTime(next) {
  const now = new Date()
  this.updatedAt = now
  if (!this.createdAt) {
    this.createdAt = now
  }
  next()
})

/**
 * Validations
 */

MainCategorySchema.path('name').validate(name => {
  return name && name.length
}, '一级类别名称不能为空')

/**
 * Methods
 */

MainCategorySchema.methods = {
  toClient() {
    const mainCategory = this.toObject()

    // call user.toClient if user field is populated
    const user = this.user
    if (user && user.toClient) {
      mainCategory.user = user.toClient()
    }

    // call subCategory.toClient if subCategories field is populated
    const subCategories = this.subCategories
    if (subCategories && subCategories.length && subCategories[0].toClient) {
      mainCategory.subCategories = subCategories.map(sub => sub.toClient())
    }

    mainCategory.id = mainCategory._id
    delete mainCategory._id
    delete mainCategory.__v

    return mainCategory
  },
}

/**
 * Statics
 */

MainCategorySchema.statics = {
  findByName(name) {
    return this.findOne({ name }).exec()
  },

  /**
   * List By User Id
   *
   * @param {ObjectId} userId 用户id
   * @param {Object} filters 过滤选项
   * @param {String} sort 排序字段
   * @param {String} order 排序方式：ASC 升序， DESC 降序
   * @returns {Promise} list of the result models
   */
  listByUserId(userId, { filters = {}, sort = 'createdAt', order = 'DESC' } = {}) {
    const orderNumber = (order === 'DESC') ? 1 : -1
    return this.find(Object.assign({}, filters, { user: userId }))
      .sort({ [sort]: orderNumber })
      .populate('subCategories')
      .exec()
  },
}

mongoose.model('MainCategory', MainCategorySchema)
