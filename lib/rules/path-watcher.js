'use strict';

const path = require('path');

module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: 'fsd relative paths watcher',
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        const importTo = node.source.value;

        const fileName = context.getFilename();

        if (shouldBeRelative(fileName, importTo)) {
          context.report({ node: node, message: 'Inside one slice paths should be relative' });
        }
      },
    };
  },
};

const isPathRelative = (path) => path.startsWith('./') | (path === '.') | path.startsWith('../');

const layers = {
  entities: 'entities',
  features: 'features',
  widgets: 'widgets',
  shared: 'shared',
  pages: 'pages',
};

const shouldBeRelative = (from, to) => {
  if (isPathRelative(to)) {
    return false;
  }

  const toArray = to.split('/');
  const toLayer = toArray[0];
  const toSlice = toArray[1];

  if (!toLayer || !toSlice || !layers[toLayer]) {
    return false;
  }

  const normalizedPath = path.toNamespacedPath(from);
  const projectFrom = normalizedPath.split('src')[1];
  const fromArray = projectFrom.split('\\');

  const fromLayer = fromArray[1];
  const fromSlice = fromArray[2];

  if (!fromLayer || !fromSlice || !layers[fromLayer]) {
    return false;
  }

  return fromLayer === toLayer && fromSlice === toSlice;
};
