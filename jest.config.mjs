/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  coverageProvider: 'v8',
  collectCoverage: true,
  collectCoverageFrom: ['src/__tests__/src/**/*.{js,jsx}'],
  setupFiles: ['./src/__tests__/setup-files/env.js'],
  testEnvironment: 'jsdom',
}
