/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/src/tests/**/*.test.ts'],
  verbose: true,
  bail: 0,
  reporters: [
    'default',
    ['jest-html-reporters', {
      publicPath: './reports',
      filename: 'report.html',
      openReport: false
    }]
  ],
  setupFilesAfterEnv: ['./src/utils/setupTests.ts'],
  globalSetup: './src/utils/globalSetup.ts',
  globalTeardown: './src/utils/globalTeardown.ts',
}; 