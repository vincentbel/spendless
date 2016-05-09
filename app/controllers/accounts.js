/**
 * Author: VincentBel
 * Date: 16/5/7
 */

'use strict'
const mongoose = require('mongoose')
const Account = mongoose.model('Account')
const UnprocessableEntityError = require('../errors/UnprocessableEntityError')

exports.create = (req, res, next) => {
  const userId = req.user.id
  const { name, type, amount } = req.body
  Account.findOne({ user: userId, name }).exec()
    .then(accountModel => {
      if (accountModel) {
        throw new UnprocessableEntityError('账户名称已存在, 账户名称必须唯一')
      }
      return new Account({ name, type, amount, user: userId }).save()
    })
    .then(accountModel => res.status(201).fjson(accountModel.toClient()))
    .catch(next)
}

exports.list = (req, res, next) => {
  return Account.list(req.user.id)
    .then(accounts => res.fjson({
      itemCount: accounts.length,
      items: accounts.map(account => account.toClient()),
    }))
    .catch(next)
}
