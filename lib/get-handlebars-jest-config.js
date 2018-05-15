const cache = require('./cache');

/**
 * This module extracts handlebars-jest relevant parts of a jest config
 *
 * @param {Object} jestConfig - a complete jest config object
 * @returns {Object} handlebarsJestConfig - an object holding handlebars-jest specific configuration
 */
module.exports = function getHandlebarsJestConfig(jestConfig) {
  const cachedConfig = cache.get('config');
  if (cachedConfig) return cachedConfig;

  const config = (jestConfig &&
      jestConfig.globals &&
      jestConfig.globals['handlebars-jest']) ||
    {};

  cache.set('config', config);

  return config;
};
