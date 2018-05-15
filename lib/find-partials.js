const fs = require('fs');
const path = require('path');

const cache = require('./cache');

const VALID_PARTIAL_EXTNAMES = ['.hbs', '.handlebars'];

/**
 * Creates a map of helper names to absolute paths to be required.
 * @param {Array} helperDirs - list of absolute paths where helpers are to be found
 * @returns {Object} - helper module names mapped to their absolute paths
 */
module.exports = function findHelpers(partialDirs) {
  const cachedPartials = cache.get('foundPartials');
  if (cachedPartials) return cachedPartials;

  let foundPartials = {};

  if (partialDirs) {
    partialDirs.forEach(function(dir) {
      try {
        fs.readdirSync(dir).forEach(function(filepath) {
          if (VALID_PARTIAL_EXTNAMES.indexOf(path.extname(filepath)) === -1)
            return;

          const fullHelperPath = path.resolve(dir, filepath);
          const helperName = getPartialNameWithoutExtension(filepath);
          foundPartials[helperName] = fullHelperPath;
        });
      } catch (err) {
        if (err.code === 'ENOENT') {
          console.warn(
            '[handlebars-jest] No such directory for helperDirs:',
            dir
          );
        } else {
          throw err;
        }
      }
    });
  }

  cache.set('foundPartials', foundPartials);

  return foundPartials;
};

function getPartialNameWithoutExtension(filepath) {
  return VALID_PARTIAL_EXTNAMES.reduce(function(shortestBasename, extension) {
    const basename = path.basename(filepath, extension);
    return basename.length < shortestBasename.length
      ? basename
      : shortestBasename;
  }, filepath);
}
