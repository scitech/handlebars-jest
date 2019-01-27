const fs = require('fs');
const path = require('path');

const cache = require('./cache');
const traverseDir = require('./traverse-dir');
const resolveRootDir = require('./resolve-root-dir');

const VALID_PARTIAL_EXTNAMES = ['.hbs', '.handlebars'];

/**
 * Creates a map of helper names to absolute paths to be required.
 * @param {Array} partialDirs - list of absolute paths where partials are to be found
 * @param {String} rootDir - Jest execution root directory: root of the directory containing the project package.json
 * @returns {Object} - helper module names mapped to their absolute paths
 */
module.exports = function findPartials(partialDirs, rootDir) {
  const cachedPartials = cache.get('foundPartials');
  if (cachedPartials) return cachedPartials;

  let foundPartials = {};

  if (partialDirs) {
    partialDirs.forEach(function(partialDir) {
      const dir = resolveRootDir(partialDir, rootDir);
      try {
        traverseDir(dir, function(filepath) {
          if (VALID_PARTIAL_EXTNAMES.indexOf(path.extname(filepath)) === -1)
            return;

          const fullPartialPath = path.resolve(dir, filepath);
          const pathFromBaseDir = path.relative(dir, fullPartialPath);
          const helperName = getPartialNameWithoutExtension(pathFromBaseDir);
          foundPartials[helperName] = fullPartialPath;
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
  return VALID_PARTIAL_EXTNAMES.reduce(function(
    shortestPartialName,
    extension
  ) {
    const basename = path.basename(filepath, extension);
    const partialName = filepath
      .split(path.sep)
      .slice(0, -1)
      .concat(basename)
      .join(path.sep);

    return partialName.length < shortestPartialName.length
      ? partialName
      : shortestPartialName;
  },
  filepath);
}
