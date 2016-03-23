/**
 * Author: VincentBel
 * Date: 16/3/23
 */

/* global describe, it, before, after */
/* eslint-disable no-unused-expressions */

'use strict'

import request from 'supertest'
import app from '../../app'
import { expect } from 'chai'
const agent = request.agent(app)

import mongoose from 'mongoose'
const MainCategory = mongoose.model('MainCategory')

describe('POST /categories/main', () => {
  describe('with valid parameter', () => {
    const name = 'daily'
    it('should response with 201', done => {
      agent
        .post('/categories/main')
        .set('Content-Type', 'application/json')
        .send({ name })
        .expect(201)
        .expect(res => {
          const body = res.body
          expect(body.error).to.not.exist
          expect(body.data).to.exist

          const data = body.data
          expect(data).to.have.property('name', name)
        })
        .end(done)
    })

    after(() => MainCategory.remove({}).exec())
  })

  describe('with conflict name', () => {
    const name = 'daily'
    before(done => {
      agent
        .post('/categories/main')
        .set('Content-Type', 'application/json')
        .send({ name })
        .expect(201)
        .end(done)
    })

    it('should response with 409 error', done => {
      agent
        .post('/categories/main')
        .set('Content-Type', 'application/json')
        .send({ name })
        .expect(409)
        .expect(res => {
          const body = res.body
          expect(body.data).to.not.exist
          expect(body.error).to.exist

          const error = body.error
          expect(error).to.have.property('code', 409)
          expect(error).to.have.property('message', `一级菜单: ${name} 已存在`)
        })
        .end(done)
    })

    after(() => MainCategory.remove({}).exec())
  })
})
