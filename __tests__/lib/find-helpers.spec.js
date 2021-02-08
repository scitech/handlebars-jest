const mock = require('mock-fs');

const cache = require('../../lib/cache');
const findHelpers = require('../../lib/find-helpers');

describe('findHelpers', function() {
  afterEach(function() {
    mock.restore();
    cache.flushAll();
  });

  test('creates a map of helper names to absolute paths', function() {
    const intendedPath = '/path/to/helpers';
    mock({
      [intendedPath]: {
        'firstHelper.js': 'module.exports = function() { return "im a helper" }',
        'secondHelper.js':'module.exports = function() { return "im a helper too" }',
      }
    });

    const expectedResult = {
      firstHelper: '/path/to/helpers/firstHelper.js',
      secondHelper: '/path/to/helpers/secondHelper.js'
    };

    const result = findHelpers(['/path/to/helpers']);
    expect(result).toEqual(expectedResult);
  });

  test('warns about nonexistent paths', function() {
    console.warn = jest.fn()
    const intendedPath = '/path/to/helpers';

    mock({
      [intendedPath]: {
        'firstHelper.js': 'module.exports = function() { return "im a helper" }',
      }
    });

    const result = findHelpers(['/wrong/path']);
    expect(console.warn.mock.calls.length).toEqual(1);
    expect(result).toEqual({});
  });

  test('only finds js when using default extensions', function() {
    const intendedPath = '/path/to/helpers';
    mock({
      [intendedPath]: {
        'notHelper.txt': 'something else',
      }
    });

    const result = findHelpers([intendedPath]);
    expect(console.warn.mock.calls.length).toEqual(1);
    expect(result).toEqual({});
  });

  test('finds mjs files using custom extensions', function() {
    const intendedPath = '/path/to/helpers';
    mock({
      [intendedPath]: {
        'myhelper.mjs': 'helper using nonstandard extension',
        'nolongerfound.js': 'helper with default extension which has been overridden',
      }
    });

    const expectedResult = {
        'myhelper': '/path/to/helpers/myhelper.mjs'
    };

    const result = findHelpers([intendedPath], null, ['.mjs']);
    expect(console.warn.mock.calls.length).toEqual(1);
    expect(result).toEqual(expectedResult);
  });

  test('subsequent calls use cache', function() {
    const intendedPath = '/path/to/helpers';
    mock({
      [intendedPath]: {
        'notHelper.txt': 'something else',
      }
    });

    const result = findHelpers([intendedPath]);
    expect(result).toEqual({});
    const cacheSetMock = jest.fn();
    cache.set = cacheSetMock;
    const secondResult = findHelpers([intendedPath]);
    expect(cacheSetMock.mock.calls.length).toEqual(0);
    expect(secondResult).toEqual(result);
  });

  test('finds nested helpers', function() {
    const intendedPath = '/path/to/helpers';
    mock({
      [intendedPath]: {
        'firsthelpers.js': 'module.exports = function() { return "im a helper" }',
        'dir': {
          'secondhelpers.js': 'module.exports = function() { return "im a helper too" }'
        },
      }
    });

    const expectedResult = {
      firsthelpers: '/path/to/helpers/firsthelpers.js',
      'dir/secondhelpers': '/path/to/helpers/dir/secondhelpers.js'
    };

    const result = findHelpers([intendedPath]);
    expect(result).toEqual(expectedResult);
  });

  test('should replace <rootDir> by jest root directory in helpers path', function () {
    // Given
    const pathToHelpers = '/path/to/helpers';
    const rootDir = '/root/directory';
    const configuredPath = `<rootDir>${pathToHelpers}`;
    const intendedPath = `${rootDir}${pathToHelpers}`;

    mock({
      [intendedPath]: {
        'firstHelper.js': 'module.exports = function() { return "im a helper" }',
        'secondHelper.js':'module.exports = function() { return "im a helper too" }',
      }
    });

    const expectedHelpers = {
      firstHelper: `${intendedPath}/firstHelper.js`,
      secondHelper: `${intendedPath}/secondHelper.js`
    };


    // When
    const helpers = findHelpers([configuredPath], rootDir);


    // Then
    expect(helpers).toEqual(expectedHelpers)
  })
});
