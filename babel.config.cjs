/**
 * Babel Configuration
 * 
 * Configures Babel transpiler for the WhoisBot project:
 * - Uses preset-env for modern JavaScript features
 * - Targets current Node.js version for compatibility
 * - Supports ES modules and CommonJS interoperability
 * 
 * This configuration enables:
 * - ES module syntax in test files
 * - Modern JavaScript features while maintaining compatibility
 * - Consistent behavior across different Node.js versions
 */

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current', // Target current Node.js version
        },
      },
    ],
  ],
};