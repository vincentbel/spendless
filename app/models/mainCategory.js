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
  name: { type: String, unique: true },
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
    const obj = this.toObject()

    obj.id = obj._id
    delete obj._id
    delete obj.__v

    return obj
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
   * List
   *
   * @param {Object} options
   * {
   *   filters: 过滤选项
   *   perPage: 每页几个条目
   *   page: 第几页（从 0 开始）
   *   sort: 排序字段
   *   order: 排序方式：ASC 升序， DESC 降序
   * }
   *
   * @return {Promise} list of the result models
   */
  list(options) {
    const filters = options.filters || {}
    const perPage = options.perPage || 1000
    const page = options.page || 0
    const sort = options.sort || 'createdAt'
    const order = (options.order && options.order === 'DESC') ? -1 : 1

    return this.find(filters)
      .sort({ [sort]: order })
      .limit(perPage)
      .skip(perPage * page)
      .populate('subCategories')
      .exec()
  },
}

mongoose.model('MainCategory', MainCategorySchema)
