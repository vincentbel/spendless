/**
 * Author: VincentBel
 * Date: 16/3/23
 */

/* global describe, it, before, after */

'use strict'

import request from 'supertest'
import app from '../../app'
const agent = request.agent(app)

import mongoose from 'mongoose'
const User = mongoose.model('User')

describe('POST /users', () => {
  it('should response with 201', done => {
    agent
      .post('/users')
      .set('Content-Type', 'application/json')
      .send({
        username: 'zqh',
        email: 'buaazqh@gmail.com',
        password: '12ei12910',
      })
      .expect(201)
      .end(done)
  })

  after(() => {
    return User.remove({}).exec()
  })
})
