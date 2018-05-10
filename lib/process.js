const Handlebars = require('handlebars');

module.exports = function(src, filename, config) {
  const hb = Handlebars.create();
  const ast = hb.parse(src);
  const template = hb.precompile(ast)
  const runtimePath = require.resolve('handlebars/runtime');

  return template ?
    'var Handlebars = require(' + JSON.stringify(runtimePath) + ');\n'
    + 'function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }\n'
    + 'module.exports = (Handlebars["default"] || Handlebars).template(' + template + ');' :
    'module.exports = function(){return "";};';
}
