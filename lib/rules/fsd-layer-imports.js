'use strict';

const path = require('path');
const { isPathRelative } = require('../helpers');
const micromatch = require('micromatch');

module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: 'check if absolute paths were imported from deep directories',
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string',
          },
          ignoreFilesPatterns: { type: 'array' },
        },
      },
    ], // Add a schema if the rule has options
  },

  create(context) {
    const { alias = '', ignoreFilesPatterns = [] } = context.options[0] || {};

    const layers = {
      app: ['pages', 'widgets', 'features', 'entities', 'shared'],
      pages: ['widgets', 'features', 'entities', 'shared'],
      widgets: ['features', 'entities', 'shared'],
      features: ['entities', 'shared'],
      entities: ['entities', 'shared'],
      shared: ['shared'],
    };

    const availableLayers = {
      app: 'app',
      pages: 'pages',
      widgets: 'widgets',
      features: 'features',
      entities: 'entities',
      shared: 'shared',
    };

    const getCurrentFileLayer = () => {
      const fileName = context.getFilename();

      const normalizedPath = path.toNamespacedPath(fileName);
      const aroundSrc = normalizedPath.split('src');
      const projectPath = aroundSrc[aroundSrc.length - 1];
      const segments = projectPath && projectPath.split('\\');

      if (segments) return segments[1];
    };

    const getImportLayer = (value = '') => {
      const importPath = alias ? value.replace(`${alias}/`, '') : value;
      const segments = importPath && importPath.split('/');

      if (segments) return segments[0];
    };

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;
        const currentFileLayer = getCurrentFileLayer();
        const importLayer = getImportLayer(importPath);

        if (isPathRelative(importPath)) return;

        if (!availableLayers[currentFileLayer] || !availableLayers[importLayer]) return;

        const isIgnored = ignoreFilesPatterns.some((pattern) =>
          micromatch.isMatch(importPath, pattern)
        );

        if (isIgnored) return;

        if (layers[currentFileLayer] && !layers[currentFileLayer].includes(importLayer)) {
          context.report({
            node,
            message:
              "A layer can only import underlying layers into itself (app -> pages -> widgets -> features -> entities(it's ok) -> shared)",
          });
        }
      },
    };
  },
};
