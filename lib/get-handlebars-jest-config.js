/**
 * This module extracts handlebars-jest relevant parts of a jest config
 *
 * @param {Object} jestConfig - a complete jest config object
 * @returns {Object} handlebarsJestConfig - an object holding handlebars-jest specific configuration
 */
module.exports = function getHandlebarsJestConfig(jestConfig) {
  return (
    (jestConfig &&
      jestConfig.globals &&
      jestConfig.globals['handlebars-jest']) ||
    {}
  );
};
