const rootDirRegexp = /\<rootDir\>/;

module.exports = function resolveRootDir(path, rootDir) {
  return path.replace(rootDirRegexp, rootDir);
};