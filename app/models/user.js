'use strict'

const mongoose = require('mongoose')
const crypto = require('crypto')
const validator = require('validator')
const Schema = mongoose.Schema

/**
 * User Schema
 */

const UserSchema = new Schema({
  username: { type: String, default: '' },
  email: { type: String, unique: true },
  hashedPassword: { type: String, default: '' },
  salt: { type: String, default: '' },
  createdAt: { type: Date },
  updatedAt: { type: Date },
})

/**
 * Virtuals
 */

UserSchema
  .virtual('password')
  .set(function (password) { // Do not use arrow function
    this._password = password
    this.salt = this.makeSalt()
    this.hashedPassword = this.encryptPassword(password)
  })
  .get(function () { // Do not use arrow function
    return this._password
  })

/**
 * Validations
 */

const validatePresenceOf = value => {
  return value && value.length
}

UserSchema.path('email').validate(email => {
  return validator.isEmail(email)
}, '邮箱格式不正确')

UserSchema.path('username').validate(username => {
  return validatePresenceOf(validatePresenceOf)
}, '用户名不能为空')

/**
 * Pre-save hook
 */

UserSchema.pre('save', function (next) { // Do not use arrow function
  if (!this.isNew) return next()

  if (!validatePresenceOf(this.password)) {
    this.password = this.generateRandomPassword()
  }
  return next()
})

UserSchema.pre('save', function (next) {
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

UserSchema.methods = {

  toClient() {
    const obj = this.toObject()

    obj.id = obj._id
    delete obj.hashedPassword
    delete obj.password
    delete obj._password
    delete obj.salt
    // delete obj._id;
    delete obj.__v

    return obj
  },

  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} plainText
   * @return {Boolean}
   * @api public
   */

  authenticate(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword
  },

  generateRandomPassword() {
    return Math.random().toString(36)
  },

  /**
   * Make salt
   *
   * @return {String} salt
   * @api public
   */
  makeSalt() {
    return String(Math.round((new Date().valueOf() * Math.random())))
  },

  /**
   * Encrypt password
   *
   * @param {String} password plain password
   * @return {String} Encrypted password
   * @api public
   */
  encryptPassword(password) {
    if (!password) return ''
    try {
      return crypto
        .createHmac('sha1', this.salt)
        .update(password)
        .digest('hex')
    } catch (err) {
      return ''
    }
  },
}

mongoose.model('User', UserSchema)
