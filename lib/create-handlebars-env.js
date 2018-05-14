const Handlebars = require('handlebars');

const createCustomCompilerClass = require('./create-custom-compiler-class');

module.exports = function createHandlebarsEnv(config) {
  const handlebarsEnv = Handlebars.create();

  handlebarsEnv.JavaScriptCompiler = createCustomCompilerClass(config);

  return handlebarsEnv;
};
