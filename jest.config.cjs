// jest.config.cjs
module.exports = {
  transform: {
    '^.+\\.js$': 'babel-jest',
    '^.+\\.mjs$': 'babel-jest', // Add this line to handle .mjs files
  },
  extensionsToTreatAsEsm: [], // Specify that only .mjs should be treated as ESM
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.mjs?(x)', '**/?(*.)+(spec|test).js?(x)'],
};