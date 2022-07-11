const cache = require('./cache');
const createHandlebarsEnv = require('./create-handlebars-env');
const getHandlebarsJestConfig = require('./get-handlebars-jest-config');

function cacheConfig(config) {

}


function precompileTemplate(src, config) {
  const hb = createHandlebarsEnv(config);
  const ast = hb.parse(src);
  return hb.precompile(ast);
}

/**
 * Transforms a handlebars template source file into a precompiled template function.
 */
module.exports = function(src, filename, config) {
  const handlebarsJestConfig = getHandlebarsJestConfig(config);
  const template = precompileTemplate(src, handlebarsJestConfig);
  const runtimePath = require.resolve('handlebars/runtime');

  return {
    code: template
    ? 'var Handlebars = require(' +
      JSON.stringify(runtimePath) +
      ');\n' +
      'function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }\n' +
      'module.exports = (Handlebars["default"] || Handlebars).template(' +
      template +
      ');'
    : 'module.exports = function(){return "";};'
  }
};
