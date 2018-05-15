const fs = require('fs');
const path = require('path');

/**
 * Recursively reads a directory and
 */
module.exports = function traverseDir(dir, callback) {
  fs.readdirSync(dir).forEach(function(filepath) {
    const joinedPath = path.join(dir,filepath);
    if (fs.statSync(joinedPath).isDirectory()) {
      traverseDir(joinedPath, callback)
    } else {
      callback(joinedPath);
    }
  });
};
