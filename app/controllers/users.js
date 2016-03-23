'use strict'

const mongoose = require('mongoose')
const User = mongoose.model('User')
const jwt = require('jsonwebtoken')
const config = require('../../config/config')
const UnprocessableEntityError = require('../errors/UnprocessableEntityError')
const ConflictError = require('../errors/ConflictError')
const validator = require('validator')

function checkEmail(email) {
  return validator.isEmail(email) ?
    Promise.resolve(email) :
    Promise.reject(new UnprocessableEntityError('邮箱格式不正确'))
}

function checkPassword(password) {
  if (!password || !password.length) {
    return Promise.reject(new UnprocessableEntityError('密码不能为空'))
  }
  if (password.length <= 6) {
    return Promise.reject(new UnprocessableEntityError('密码长度至少为6位'))
  }
  return Promise.resolve(password)
}

// create a new user
exports.create = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  checkEmail(email)
    .then(() => checkPassword(password))
    .then(() => User.findByEmail(email))
    .then(user => {
      if (user) {
        throw new ConflictError('邮箱已注册')
      }
      return new User(req.body).save()
    })
    .then(user => {
      const userObject = user.toClient()

      res.status(201).fjson(Object.assign({}, userObject, {
        token: jwt.sign(userObject, config.jwtSecretKey),
      }))
    })
    .catch(next)
}

// 登录
exports.login = (req, res, next) => {
  const email = req.body.email
  const password = req.body.password
  checkEmail(email)
    .then(User.findByEmail.bind(User))
    .then(user => {
      if (!user || !user.authenticate(password)) {
        throw new UnprocessableEntityError('用户名或密码错误')
      }
      return user
    })
    .then(user => {
      const userObject = user.toClient()
      res.fjson(Object.assign({}, userObject, {
        token: jwt.sign(userObject, config.jwtSecretKey),
      }))
    })
    .catch(next)
}
