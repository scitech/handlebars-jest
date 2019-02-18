const mock = require('mock-fs');

const cache = require('../../lib/cache');
const findPartials = require('../../lib/find-partials');

describe('findPartials', function() {
  afterEach(function() {
    mock.restore();
    cache.flushAll();
  });

  test('creates a map of partial names to absolute paths', function() {
    const intendedPath = '/path/to/partials';
    mock({
      [intendedPath]: {
        'firstpartial.hbs': 'module.exports = function() { return "im a partial" }',
        'secondpartial.hbs':'module.exports = function() { return "im a partial too" }',
      }
    });

    const expectedResult = {
      firstpartial: '/path/to/partials/firstpartial.hbs',
      secondpartial: '/path/to/partials/secondpartial.hbs'
    };

    const result = findPartials([intendedPath]);
    expect(result).toEqual(expectedResult);
  });

  test('warns about nonexistent paths', function() {
    console.warn = jest.fn()
    const intendedPath = '/path/to/partials';

    mock({
      [intendedPath]: {
        'firstpartial.hbs': 'module.exports = function() { return "im a partial" }',
      }
    });

    const result = findPartials(['/wrong/path']);
    expect(console.warn.mock.calls.length).toEqual(1);
    expect(result).toEqual({});
  });

  test('only finds hbs', function() {
    const intendedPath = '/path/to/partials';
    mock({
      [intendedPath]: {
        'notpartial.txt': 'something else',
      }
    });

    const result = findPartials([intendedPath]);
    expect(result).toEqual({});
  });

  test('subsequent calls use cache', function() {
    const intendedPath = '/path/to/partials';
    mock({
      [intendedPath]: {
        'notpartial.txt': 'something else',
      }
    });

    const result = findPartials([intendedPath]);
    expect(result).toEqual({});
    const cacheSetMock = jest.fn();
    cache.set = cacheSetMock;
    const secondResult = findPartials([intendedPath]);
    expect(cacheSetMock.mock.calls.length).toEqual(0);
    expect(secondResult).toEqual(result);
  });

  test('finds nested partials', function() {
    const intendedPath = '/path/to/partials';
    mock({
      [intendedPath]: {
        'firstpartial.hbs': 'module.exports = function() { return "im a partial" }',
        'dir': {
          'secondpartial.hbs': 'module.exports = function() { return "im a partial too" }'
        },
      }
    });

    const expectedResult = {
      firstpartial: '/path/to/partials/firstpartial.hbs',
      'dir/secondpartial': '/path/to/partials/dir/secondpartial.hbs'
    };

    const result = findPartials([intendedPath]);
    expect(result).toEqual(expectedResult);
  });

  test('should replace <rootDir> by jest root directory in partials path', function () {
    // Given
    const pathToPartials = '/path/to/partials';
    const rootDir = '/root/directory';
    const configuredPath = `<rootDir>${pathToPartials}`;
    const intendedPath = `${rootDir}${pathToPartials}`;

    mock({
      [intendedPath]: {
        'firstPartial.hbs': 'module.exports = function() { return "im a partial" }',
        'secondPartial.hbs':'module.exports = function() { return "im a partial too" }',
      }
    });

    const expectedPartials = {
      firstPartial: `${intendedPath}/firstPartial.hbs`,
      secondPartial: `${intendedPath}/secondPartial.hbs`
    };


    // When
    const partials = findPartials([configuredPath], rootDir);


    // Then
    expect(partials).toEqual(expectedPartials)
  })
});
