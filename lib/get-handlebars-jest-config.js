const cache = require('./cache');

/**
 * This module extracts handlebars-jest relevant parts of a jest config
 *
 * @param {Object} jestConfig - a complete jest config object
 * @returns {Object} handlebarsJestConfig - an object holding handlebars-jest specific configuration
 */
module.exports = function getHandlebarsJestConfig(opts) {
  const cachedConfig = cache.get('config');
  if (cachedConfig) return cachedConfig;

  var jestConfig = opts || {};
  if (!jestConfig.globals) {
    jestConfig = jestConfig.config || {};
  }

  const config = (jestConfig &&
      jestConfig.globals &&
      jestConfig.globals['handlebars-jest']) ||
    {};

  if(jestConfig && jestConfig.rootDir) {
    config.rootDir = jestConfig.rootDir;
  } else {
    console.warn('Can\'t find rootDir from jest configuration', jestConfig);
  }

  cache.set('config', config);

  return config;
};
