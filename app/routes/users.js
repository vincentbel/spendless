'use strict'

const express = require('express')
const router = express.Router() // eslint-disable-line new-cap

const userController = require('../controllers/users')

router.post('/', userController.create)

module.exports = router
