/**
 * Author: VincentBel
 * Date: 16/5/7
 */

'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const allTypes = [
  'cash',
  'debitCard',
  'creditCard',
  'alipay',
  'wechatpay',
  'others',
]

const allTypesValues = {
  cash: '现金',
  debitCard: '储蓄卡',
  creditCard: '信用卡',
  alipay: '支付宝',
  wechatpay: '微信支付',
  others: '其他',
}

const allTypesMessage = allTypes.reduce((acc, cur) => `${acc}、${allTypesValues[cur]}`, '')

/**
 * Account Schema
 */
const AccountSchema = new Schema({
  name: { type: String, required: true },
  type: { type: String },
  amount: { type: Number },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date },
  updatedAt: { type: Date },
})

/**
 * pre
 */
AccountSchema.pre('save', function updateCreatedAndUpdatedTime(next) {
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

AccountSchema.path('name').validate(name => {
  return name.length
}, '账户名称不能为空')

AccountSchema.path('type').validate(type => {
  return allTypes.indexOf(type) !== -1
}, `账户类型必须是“${allTypesMessage}”之一`)

/**
 * Methods
 */

AccountSchema.methods = {
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

AccountSchema.statics = {

  /**
   * List
   *
   * @param {ObjectId} userId 用户id
   * @param {Object} filters 过滤选项
   * @param {String} sort 排序字段
   * @param {Number} perPage 每页几个条目
   * @param {Number} page 第几页（从 0 开始）
   * @param {String} order 排序方式：ASC 升序， DESC 降序
   * @returns {Promise} list of the result models
   */
  list(userId, { filters = {}, sort = 'createdAt', perPage = 30, page = 0, order = 'DESC' } = {}) {
    const orderNumber = (order === 'DESC') ? 1 : -1
    return this.find(Object.assign({}, filters, { user: userId }))
      .sort({ [sort]: orderNumber })
      .limit(perPage)
      .skip(perPage * page)
      .exec()
  },
}

mongoose.model('Account', AccountSchema)
