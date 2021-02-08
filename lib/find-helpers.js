const fs = require('fs');
const path = require('path');

const cache = require('./cache');
const traverseDir = require('./traverse-dir');
const resolveRootDir = require('./resolve-root-dir');

const DEFAULT_VALID_HELPER_EXTNAMES = ['.js'];

/**
 * Creates a map of helper names to absolute paths to be required.
 * @param {Array} helperDirs - list of absolute paths where helpers are to be found
 * @param {String} rootDir - Jest execution root directory: root of the directory containing the project package.json
 * @param {Array} helperExtensions - Array of valid javascript filename extensions
 * @returns {Object} - helper module names mapped to their absolute paths
 */
module.exports = function findHelpers(helperDirs, rootDir, helperExtensions = DEFAULT_VALID_HELPER_EXTNAMES) {
  const cachedHelpers = cache.get('foundHelpers');
  if (cachedHelpers) return cachedHelpers;

  let foundHelpers = {};

  if (helperDirs) {
    helperDirs.forEach(function(helperDir) {
      const dir = resolveRootDir(helperDir, rootDir);
      try {
        traverseDir(dir, function(filepath) {
          if (!helperExtensions.includes(path.extname(filepath))) return;

          const fullHelperPath = path.resolve(dir, filepath);
          const pathFromBaseDir = path.relative(dir, fullHelperPath);
          const helperName = getHelperNameWithoutExtension(pathFromBaseDir);
          foundHelpers[helperName] = fullHelperPath;
        })
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

  cache.set('foundHelpers', foundHelpers);

  return foundHelpers;
};

function getHelperNameWithoutExtension(filepath) {
  const basename = path.basename(filepath, path.extname(filepath));
  const partialName = filepath
    .split(path.sep)
    .slice(0, -1)
    .concat(basename)
    .join(path.sep);

  return partialName;
}
