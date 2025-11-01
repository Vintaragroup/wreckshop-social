import '@testing-library/jest-dom'

// MSW node server for tests
import { server } from './mocks/server'

// Use 'bypass' so backend supertest HTTP calls aren't blocked by MSW in Node tests.
beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
