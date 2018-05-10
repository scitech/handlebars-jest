const findHelpers = require('../../lib/find-helpers');
const mock = require('mock-fs');

describe('findHelpers', function() {
  afterEach(function() {
    mock.restore();
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

  test('only finds js', function() {
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
});
