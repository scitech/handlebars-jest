const fs = require('fs');
const path = require('path');

/**
 * Creates a map of helper names to absolute paths to be required.
 * @param {Array} helperDirs - list of absolute paths where helpers are to be found
 * @returns {Object} - helper module names mapped to their absolute paths
 */
module.exports = function findHelpers(helperDirs) {
  let foundHelpers = {};

  helperDirs.forEach(function(dir) {
    try {
      fs.readdirSync(dir).forEach(function(filepath) {
        if (path.extname(filepath) !== '.js') return;

        const fullHelperPath = path.resolve(dir, filepath);
        const helperName = path.basename(filepath, '.js');
        foundHelpers[helperName] = fullHelperPath;
      });
    } catch(err) {
      if (err.code === 'ENOENT') {
        console.warn('[handlebars-jest] No such directory for helperDirs:', dir);
      } else {
        throw err;
      }
    }
  });

  return foundHelpers;
}
