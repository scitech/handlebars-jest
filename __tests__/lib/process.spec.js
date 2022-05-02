const process = require('../../lib/process');

describe('process', function() {
  test('should run', function() {
    const mockContents = '<div></div>';

    const result = process(mockContents);
    expect(typeof result.code).toEqual('string');
  });
});
