const cache = require('../../lib/cache');
const getHandlebarsJestConfig = require('../../lib/get-handlebars-jest-config');

describe('getHandlebarsJestConfig', function() {
  afterEach(function() {
    cache.flushAll();
  });

  test('gets the handlebars-jest config when present', function() {
    const expectedResult = {
      some: 'value',
    };
    const jestConfig = {
      globals: {
        'handlebars-jest': expectedResult,
      },
    };

    const result = getHandlebarsJestConfig(jestConfig);
    expect(result).toEqual(expectedResult);
  });

  test('empty object when not present', function() {
    const jestConfig = {
      name: 'somethingElse',
    };

    const result = getHandlebarsJestConfig(jestConfig);
    expect(result).toEqual({});
  });

  test('subsequent calls use cache', function() {
    const jestConfig = {
      name: 'somethingElse',
    };

    const result = getHandlebarsJestConfig(jestConfig);
    expect(result).toEqual({});
    const cacheSetMock = jest.fn();
    cache.set = cacheSetMock;
    expect(cacheSetMock.mock.calls.length).toEqual(0);
  });

  test('store jest rootDir in config when present', function() {
    // Given
    const jestConfig = {
      name: 'somethingElse',
      rootDir: '/root/directory'
    };

    // When
    const result = getHandlebarsJestConfig(jestConfig);

    // Then
    expect(result).toEqual({'rootDir': '/root/directory'});
  });

  test('A warning should be displayed if no jest root directory was found', function() {
    // Given
    const jestConfig = {
      name: 'somethingElse',
    };
    console.warn = jest.fn();

    // When
    const result = getHandlebarsJestConfig(jestConfig);

    // Then
    expect(result).toEqual({});
    expect(console.warn.mock.calls.length).toEqual(1);
  })
});
