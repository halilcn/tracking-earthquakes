/*
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  coverageProvider: 'v8',
  collectCoverage: true,
  collectCoverageFrom: ['./__tests__/src/**/*.{js,jsx}'],
  setupFiles: ['./__tests__/setup-files/env.js'],
  setupFilesAfterEnv: ['./__tests__/setup-files/packages.js'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'identity-obj-proxy',
    '\\.(css|scss)$': 'identity-obj-proxy',
  },
}
