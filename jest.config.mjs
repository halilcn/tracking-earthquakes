/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  coverageProvider: 'v8',
  roots: ['./__tests__/src'],
  collectCoverage: true,
  collectCoverageFrom: ['./src/**/*.{js,jsx}'],
  setupFiles: ['./__tests__/setup-files/env.js'],
  setupFilesAfterEnv: ['./__tests__/setup-files/packages.js'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(png|jpg|webp|ttf|woff|woff2|svg|mp4|mp3)$': '<rootDir>/__tests__/mocks/file-mock.js',
    '\\.(css|scss)$': 'identity-obj-proxy',
  },
}
