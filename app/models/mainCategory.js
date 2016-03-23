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
}

mongoose.model('MainCategory', MainCategorySchema)
