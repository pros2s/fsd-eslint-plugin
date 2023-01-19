'use strict';

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
            types: 'string',
          },
          testFilesPatterns: { types: 'array' },
        },
      },
    ], // Add a schema if the rule has options
  },

  create(context) {
    const { alias = '', testFilesPatterns = [] } = context.options[0] || {};

    const availableLayers = {
      entities: 'entities',
      features: 'features',
      widgets: 'widgets',
      pages: 'pages',
    };

    return {
      ImportDeclaration(node) {
        const value = node.source.value;
        const importTo = alias ? value.replace(`${alias}/`, '') : value;

        if (isPathRelative(importTo)) return;

        const segments = importTo.split('/');

        const layer = segments[0];

        if (!availableLayers[layer]) return;

        const isImportNotFromPublicApi = segments.length > 2;
        const isTestingPublicApi = segments[2] === 'testing' && segments.length < 4;

        if (isImportNotFromPublicApi && !isTestingPublicApi) {
          context.report({
            node,
            message: 'Absolute paths are allowed only from public api (index.ts)',
          });
        }

        if (isTestingPublicApi) {
          const currentFileName = context.getFilename();

          const isCurrentFileTesting = testFilesPatterns.some((pattern) =>
            micromatch.isMatch(currentFileName, pattern)
          );

          if (!isCurrentFileTesting) {
            context.report({
              node,
              message: 'Testing data are allowed only from testing public api (testing.ts)',
            });
          }
        }
      },
    };
  },
};
