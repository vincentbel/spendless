'use strict'

const apiVersion = require('../../config/config').apiVersion

module.exports = exports = (req, res, next) => {
  // 定义全局的JSON返回格式
  res.fjson = function fjson(obj) { // eslint-disable-line no-param-reassign
    return res.json({
      apiVersion,
      data: obj,
    })
  }

  // 定义全局的出错时的JSON返回格式
  res.fjsone = function fjsone(err) { // eslint-disable-line no-param-reassign
    const statusCode = err.statusCode || 500

    return res.status(statusCode).json({
      apiVersion,
      error: {
        code: statusCode,
        message: err.message,
        errors: err.errors,
      },
    })
  }
  next()
}
