/**
 * Author: VincentBel
 * Date: 16/3/23
 */

'use strict'
const mongoose = require('mongoose')
const Schema = mongoose.Schema


/**
 * SubCategory Schema
 */
const SubCategorySchema = new Schema({
  name: { type: String, unique: true },
  star: { type: Boolean, default: false },
  createdAt: { type: Date },
  updatedAt: { type: Date },
})

/**
 * pre
 */
SubCategorySchema.pre('save', function updateCreatedAndUpdatedTime(next) {
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

SubCategorySchema.path('name').validate(name => {
  return name && name.length
}, '类别名称不能为空')

/**
 * Methods
 */

SubCategorySchema.methods = {
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

SubCategorySchema.statics = {
  findByName(name) {
    return this.findOne({ name }).exec()
  },
}

mongoose.model('SubCategory', SubCategorySchema)
