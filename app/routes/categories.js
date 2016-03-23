/**
 * Author: VincentBel
 * Date: 16/3/23
 */

'use strict'

const router = require('express').Router() // eslint-disable-line new-cap
const mainCategoryController = require('../controllers/mainCategories')

router.route('/main')
  .post(mainCategoryController.create)

module.exports = router
