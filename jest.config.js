const nextJest = require("next/jest")

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: "./",
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: ["**/__tests__/**/*.(test|spec).(js|jsx)", "**/*.(test|spec).(js|jsx)"],
  collectCoverageFrom: [
    "app/**/*.{js,jsx}",
    "server/**/*.{js,jsx}",
    "!app/**/*.d.ts",
    "!app/**/layout.jsx",
    "!app/**/loading.jsx",
    "!app/**/not-found.jsx",
    "!app/**/error.jsx",
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  testTimeout: 10000,
  verbose: true,
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)
