'use strict'

const express = require('express')
const router = express.Router() // eslint-disable-line new-cap
const requireAuth = require('../middleware/authorization').requireAuth

const userController = require('../controllers/users')

module.exports = router
