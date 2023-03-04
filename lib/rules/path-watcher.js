'use strict';

const path = require('path');
const { isPathRelative } = require('../helpers');

module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: 'fsd relative paths watcher',
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: 'code', // Or `code` or `whitespace`
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            typs: 'string',
          },
        },
      },
    ], // Add a schema if the rule has options
  },

  create(context) {
    let alias;
    if (context.options[0]) {
      alias = context.options[0].alias || '';
    }

    return {
      ImportDeclaration(node) {
        const value = node.source.value;
        const importTo = alias ? value.replace(`${alias}/`, '') : value;

        const fileName = context.getFilename();

        if (shouldBeRelative(fileName, importTo)) {
          context.report({
            node,
            message: 'Inside one slice paths should be relative',
            fix: (fixer) => {
              const normalizedPath = getNormalizedCurrentFilePath(fileName)
                .split('/')
                .slice(0, -1)
                .join('/');

              let ralativePath = path
                .relative(normalizedPath, `/${importTo}`)
                .split('\\')
                .join('/');

              if (!ralativePath.startsWith('.')) {
                ralativePath = './' + ralativePath;
              }

              return fixer.replaceText(node.source, `'${ralativePath}'`);
            },
          });
        }
      },
    };
  },
};

const layers = {
  entities: 'entities',
  features: 'features',
  widgets: 'widgets',
  shared: 'shared',
  pages: 'pages',
};

function getNormalizedCurrentFilePath(currentPath) {
  const normalizedPath = path.toNamespacedPath(currentPath);
  const aroundSrc = normalizedPath.split('src');
  const projectFrom = aroundSrc[aroundSrc.length - 1];

  return projectFrom.split('\\').join('/');
}

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

  const projectFrom = getNormalizedCurrentFilePath(from);
  const fromArray = projectFrom.split('/');

  const fromLayer = fromArray[1];
  const fromSlice = fromArray[2];

  if (!fromLayer || !fromSlice || !layers[fromLayer]) {
    return false;
  }

  return fromLayer === toLayer && fromSlice === toSlice;
};
