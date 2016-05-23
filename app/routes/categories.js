/**
 * Author: VincentBel
 * Date: 16/3/23
 */

'use strict'

const router = require('express').Router() // eslint-disable-line new-cap
const categoryController = require('../controllers/categories')
const requireAuth = require('../middleware/authorization').requireAuth

router.get('/', requireAuth, categoryController.list)
router.post('/', requireAuth, categoryController.createMain)
router.post('/:mainCategoryId', requireAuth, categoryController.createSub)

module.exports = router
