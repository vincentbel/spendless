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

mongoose.model('Account', AccountSchema)
