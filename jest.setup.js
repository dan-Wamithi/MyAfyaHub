"use client"

import jest from "jest"
import "@testing-library/jest-dom"
import { beforeAll, afterAll } from "@jest/globals"

// Mock Next.js router
jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "/",
      query: {},
      asPath: "/",
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    }
  },
}))

// Mock environment variables
process.env.NODE_ENV = "test"
process.env.MONGODB_URI = "mongodb://localhost:27017/afyahub-test"

// Mock window.confirm
Object.defineProperty(window, "confirm", {
  writable: true,
  value: jest.fn(() => true),
})

// Mock console methods to reduce noise in tests
const originalError = console.error
const originalWarn = console.warn

beforeAll(() => {
  console.error = (...args) => {
    if (typeof args[0] === "string" && args[0].includes("Warning: ReactDOM.render is no longer supported")) {
      return
    }
    originalError.call(console, ...args)
  }

  console.warn = (...args) => {
    if (typeof args[0] === "string" && args[0].includes("componentWillReceiveProps has been renamed")) {
      return
    }
    originalWarn.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
  console.warn = originalWarn
})

// Global test utilities
global.testUtils = {
  // Helper to create mock API responses
  createMockResponse: (data, status = 200) => ({
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
  }),

  // Helper to create mock bugs
  createMockBug: (overrides = {}) => ({
    _id: "507f1f77bcf86cd799439011",
    title: "Test Bug",
    description: "Test Description",
    severity: "medium",
    status: "open",
    reporter: "John Doe",
    assignee: "Jane Smith",
    createdAt: "2024-01-01T00:00:00.000Z",
    updatedAt: "2024-01-01T00:00:00.000Z",
    ...overrides,
  }),
}
