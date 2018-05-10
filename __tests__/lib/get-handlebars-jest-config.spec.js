const getHandlebarsJestConfig = require('../../lib/get-handlebars-jest-config');

describe('getHandlebarsJestConfig', function() {
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
});
