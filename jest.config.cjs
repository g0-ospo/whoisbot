/**
 * Jest Configuration
 * 
 * Configures Jest testing framework for the WhoisBot project:
 * - Handles both CommonJS and ES Modules
 * - Uses babel-jest for transformations
 * - Configures Node.js test environment
 * - Defines test file patterns
 * 
 * @type {import('@jest/types').Config.InitialOptions}
 */
module.exports = {
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.mjs$': 'babel-jest', // Transform both .js and .mjs files
  },
  extensionsToTreatAsEsm: [], // ESM handling configuration
  testEnvironment: 'node',  // Use Node.js environment for testing
  testMatch: [
    '**/__tests__/**/*.mjs?(x)',  // Match test files in __tests__ directories
    '**/?(*.)+(spec|test).js?(x)' // Match .spec.js and .test.js files
  ],
};