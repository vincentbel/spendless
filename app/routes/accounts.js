/**
 * Author: VincentBel
 * Date: 16/5/7
 */

'use strict'

const express = require('express')
const router = express.Router() // eslint-disable-line new-cap
const requireAuth = require('../middleware/authorization').requireAuth
const accountController = require('../controllers/accounts')

router.get('/', requireAuth, accountController.list)
router.post('/', requireAuth, accountController.create)

module.exports = router
