const fs = require('fs');
const Handlebars = require('handlebars');
const path = require('path');

const getHandlebarsJestConfig = require('./get-handlebars-jest-config');

function createHandlebarsEnv(config) {
  const handlebarsEnv = Handlebars.create();
  const JavaScriptCompiler = handlebarsEnv.JavaScriptCompiler;

  function MyJavaScriptCompiler() {
    JavaScriptCompiler.apply(this, arguments);
  }

  const foundHelpers = findHelpers(config.helperDirs)

  MyJavaScriptCompiler.prototype = Object.create(JavaScriptCompiler.prototype);
  MyJavaScriptCompiler.prototype.compiler = MyJavaScriptCompiler;
  MyJavaScriptCompiler.prototype.nameLookup = function(parent, name, type) {
    if (type === "helper") {
      if (foundHelpers[name]) {
        return "__default(require(" + JSON.stringify(foundHelpers[name]) + "))";
      }
      foundHelpers[name] = null;
      return JavaScriptCompiler.prototype.nameLookup.apply(this, arguments);
    }

    return JavaScriptCompiler.prototype.nameLookup.apply(this, arguments);
  };

  handlebarsEnv.JavaScriptCompiler = MyJavaScriptCompiler;

  return handlebarsEnv;
}

function findHelpers(helperDirs) {
  let foundHelpers = {}
  helperDirs.forEach(function(dir) {
    fs.readdirSync(dir).forEach(function(filepath) {
      const fullHelperPath = path.resolve(dir, filepath);
      const helperName = path.basename(filepath, '.js');
      foundHelpers[helperName] = fullHelperPath;
    })
  })
  return foundHelpers;
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

  return template
    ? 'var Handlebars = require(' +
        JSON.stringify(runtimePath) +
        ');\n' +
        'function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }\n' +
        'module.exports = (Handlebars["default"] || Handlebars).template(' +
        template +
        ');'
    : 'module.exports = function(){return "";};';
};
