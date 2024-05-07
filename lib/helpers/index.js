const isPathRelative = (path = '') => path.startsWith('./') | (path === '.') | path.startsWith('../');

const getIndexApiMessage = (deepLevel) =>
  `Absolute paths are allowed only from public api (index.ts)\nDeep Level ${deepLevel}`;

module.exports = {
  isPathRelative,
  getIndexApiMessage,
};
