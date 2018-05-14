const findPartials = require('../../lib/find-partials');
const mock = require('mock-fs');

describe('findPartials', function() {
  afterEach(function() {
    mock.restore();
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

    const result = findPartials(['/path/to/partials']);
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
    expect(console.warn.mock.calls.length).toEqual(1);
    expect(result).toEqual({});
  });
});
