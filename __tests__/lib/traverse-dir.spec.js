const path = require('path');

const traverseDir = require('../../lib/traverse-dir');

const FIXTURES_PATH = path.resolve(__dirname, '../../__fixtures__');

describe('traverseDir', function() {
  test('calls a function on files in a directory', function() {
    const fixturePath = path.resolve(FIXTURES_PATH, 'dirWithFile');

    const callbackMock = jest.fn();
    traverseDir(fixturePath, callbackMock);
    expect(callbackMock.mock.calls.length).toEqual(1);
  });

  test('works with nested paths', function() {
    const fixturePath = path.resolve(FIXTURES_PATH, 'dirWithNestedDirs');

    const callbackMock = jest.fn();
    traverseDir(fixturePath, callbackMock);
    expect(callbackMock.mock.calls.length).toEqual(2);
  });
});
