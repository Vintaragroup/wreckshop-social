// @vitest-environment node
import { describe, it, expect } from 'vitest'
import Profile from '../src/models/profile'

describe('Profile model', () => {
  it('validates required fields', () => {
    const doc = new (Profile as any)({})
    const err = doc.validateSync()
    expect(err).toBeTruthy()
    expect(err?.errors?.displayName).toBeTruthy()
  })

  it('accepts a minimal valid document', () => {
    const doc = new (Profile as any)({ displayName: 'Test User', identities: [], taste: {} })
    const err = doc.validateSync()
    expect(err).toBeUndefined()
  })
})
