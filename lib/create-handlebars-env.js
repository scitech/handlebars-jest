const Handlebars = require('handlebars');

const findHelpers = require('./find-helpers');
const getHandlebarsJestConfig = require('./get-handlebars-jest-config');

module.exports = function createHandlebarsEnv(config) {
  const handlebarsEnv = Handlebars.create();
  const JavaScriptCompiler = handlebarsEnv.JavaScriptCompiler;

  const foundHelpers =
    config && config.helperDirs ? findHelpers(config.helperDirs) : {};

  function CustomCompiler() {
    JavaScriptCompiler.apply(this, arguments);
  }

  CustomCompiler.prototype = Object.create(JavaScriptCompiler.prototype);
  CustomCompiler.prototype.compiler = CustomCompiler;
  CustomCompiler.prototype.nameLookup = function(parent, name, type) {
    if (type === 'helper') {
      if (foundHelpers[name]) {
        return '__default(require(' + JSON.stringify(foundHelpers[name]) + '))';
      }
      foundHelpers[name] = null;
      return JavaScriptCompiler.prototype.nameLookup.apply(this, arguments);
    }

    return JavaScriptCompiler.prototype.nameLookup.apply(this, arguments);
  };

  handlebarsEnv.JavaScriptCompiler = CustomCompiler;

  return handlebarsEnv;
};
