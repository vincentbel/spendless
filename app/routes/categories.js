/**
 * Author: VincentBel
 * Date: 16/3/23
 */

'use strict'

const router = require('express').Router() // eslint-disable-line new-cap
const categoryController = require('../controllers/categories')

router.post('/', categoryController.createMain)
router.post('/:mainCategoryId', categoryController.createSub)

module.exports = router
