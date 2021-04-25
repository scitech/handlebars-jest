const path = require('path');
const Handlebars = require('handlebars');

const findHelpers = require('./find-helpers');
const findPartials = require('./find-partials');
const getHandlebarsJestConfig = require('./get-handlebars-jest-config');

module.exports = function createCustomCompiler() {
  const config = getHandlebarsJestConfig();
  const foundHelpers = findHelpers(config.helperDirs, config.rootDir, config.helperExtensions);
  const foundPartials = findPartials(config.partialDirs, config.rootDir, config.partialExtensions);

  const JavaScriptCompiler = Handlebars.JavaScriptCompiler;

  function CustomCompiler() {
    JavaScriptCompiler.apply(this, arguments);
  }

  CustomCompiler.prototype = Object.create(JavaScriptCompiler.prototype);
  CustomCompiler.prototype.compiler = CustomCompiler;
  CustomCompiler.prototype.nameLookup = function(parent, name, type) {
    name = path.normalize(name);
    if (type === 'partial') {
      if (name === '@partial-block') {
        return JavaScriptCompiler.prototype.nameLookup.apply(this, arguments);
      }
      if (foundPartials[name]) {
        return 'require(' + JSON.stringify(foundPartials[name]) + ')';
      }
      foundPartials[name] = null;
      return JavaScriptCompiler.prototype.nameLookup.apply(this, arguments);
    } else if (type === 'helper') {
      if (foundHelpers[name]) {
        return '__default(require(' + JSON.stringify(foundHelpers[name]) + '))';
      }
      foundHelpers[name] = null;
      return JavaScriptCompiler.prototype.nameLookup.apply(this, arguments);
    }

    return JavaScriptCompiler.prototype.nameLookup.apply(this, arguments);
  };

  return CustomCompiler;
};
