const Handlebars = require('handlebars');
const mock = require('mock-fs');

const createCustomCompilerClass = require('../../lib/create-custom-compiler-class');

describe('CustomCompiler', function() {
  afterEach(function() {
    mock.restore();
  });

  test('subclasses Handlebars JavaScriptCompiler', function() {
    const CustomCompiler = createCustomCompilerClass();
    expect(new CustomCompiler()).toBeInstanceOf(Handlebars.JavaScriptCompiler);
  });

  test('can be configured', function() {
    mock({
      '/some/path': {},
      '/other/path': {},
    });

    const CustomCompiler = createCustomCompilerClass({
      helperDirs: ['/some/path'],
      partialDirs: ['/other/path'],
      partialExtensions: ['.html']
    });

    expect(new CustomCompiler()).toBeInstanceOf(Handlebars.JavaScriptCompiler);
  });

  describe('#nameLookup', function() {
    const CustomCompiler = createCustomCompilerClass();
  });
});
