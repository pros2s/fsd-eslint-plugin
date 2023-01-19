const isPathRelative = (path) => path.startsWith('./') | (path === '.') | path.startsWith('../');

module.exports = {
  isPathRelative,
};
