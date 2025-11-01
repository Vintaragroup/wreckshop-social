// @vitest-environment node
import express from 'express'
import request from 'supertest'
import { describe, it, expect } from 'vitest'
import { health } from '../src/routes/health'

describe('health router', () => {
  it('GET /api/health -> { ok: true }', async () => {
    const app = express()
    app.use('/api', health)
    const res = await request(app).get('/api/health')
    expect(res.status).toBe(200)
    expect(res.body).toEqual({ ok: true })
  })
})
