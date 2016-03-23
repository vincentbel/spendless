/**
 * Author: VincentBel
 * Date: 16/3/23
 */

/* global describe, it, before, after */
/* eslint-disable no-unused-expressions */

'use strict'

import request from 'supertest'
import { expect } from 'chai'
import app from '../../app'
const agent = request.agent(app)

import mongoose from 'mongoose'
const User = mongoose.model('User')
const userInfo = {
  username: 'zqh',
  email: 'buaazqh@gmail.com',
  password: '12ei12910',
}

describe('POST /login', () => {
  before(done => {
    agent
      .post('/users')
      .set('Content-Type', 'application/json')
      .send(userInfo)
      .expect(201)
      .end(done)
  })

  it('should response with 200', done => {
    agent
      .post('/login')
      .set('Content-Type', 'application/json')
      .send({
        email: userInfo.email,
        password: userInfo.password,
      })
      .expect(200)
      .expect(res => {
        const body = res.body
        expect(body.error).to.not.exist
        expect(body.data).to.exist

        const data = body.data
        expect(data).to.have.property('email', userInfo.email)
        expect(data).to.have.property('token').and.to.be.not.empty
      })
      .end(done)
  })

  after(() => {
    return User.remove({}).exec()
  })
})
