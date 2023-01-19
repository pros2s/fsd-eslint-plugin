'use strict';

const { isPathRelative } = require('../helpers');

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

        if (isImportNotFromPublicApi) {
          context.report({
            node,
            message: 'Absolute paths are allowed only from public api (index.ts)',
          });
        }
      },
    };
  },
};
