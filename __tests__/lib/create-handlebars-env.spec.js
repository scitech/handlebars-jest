const Handlebars = require('handlebars');
const mock = require('mock-fs');

const createHandlebarsEnv = require('../../lib/create-handlebars-env');

describe('createHandlebarsEnv', function() {
  afterEach(function() {
    mock.restore();
  });

  test('creates a handlebars environment with empty config', function() {
    const result = createHandlebarsEnv();
    expect(result).toBeInstanceOf(Handlebars.HandlebarsEnvironment);
  });

  test('creates a handlebars environment with additional options', function() {
    mock({
      '/some/path': {
        'helper.js': 'module.exports = function() { return "im a helper" }',
      }
    });

    const result = createHandlebarsEnv({
      helperDirs: ['/some/path']
    });

    expect(result).toBeInstanceOf(Handlebars.HandlebarsEnvironment);
  });
});
