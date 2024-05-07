'use strict';

const { isPathRelative, getIndexApiMessage } = require('../helpers');
const micromatch = require('micromatch');

const TESTING_INDEX_API = 'TESTING_INDEX_API';

module.exports = {
  meta: {
    type: 'suggestion', // `problem`, `suggestion`, or `layout`
    docs: {
      description: 'check if absolute paths were imported from deep directories',
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: 'code', // Or `code` or `whitespace`
    messages: {
      [TESTING_INDEX_API]: 'Testing data are allowed only from testing public api (testing.ts)',
    },
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            types: 'string',
          },
          testFilesPatterns: { types: 'array' },
          deepFilePatterns: { types: 'array' },
        },
      },
    ], // Add a schema if the rule has options
  },

  create(context) {
    const { alias = '', testFilesPatterns = [], deepFilePatterns = [] } = context.options[0] || {};

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
        const slice = segments[1];

        if (!availableLayers[layer]) return;

        const deepFilePattern = deepFilePatterns.find((pattern) => importTo.includes(pattern));
        const deepFileParts = deepFilePattern ? deepFilePattern.split('/') : [];
        const deepFileLevel = deepFilePattern ? deepFileParts.length : 2;

        const isImportNotFromPublicApi = segments.length > deepFileLevel;
        const isTestingPublicApi =
          segments[deepFileLevel] === 'testing' && segments.length < deepFileLevel + 2;

        const getFixedImport = (deepLevel) => {
          let resImport = `'${alias}/${layer}/${slice}'`;

          for (let i = 0; i < deepLevel - 2; i++) {
            const lastPart = deepFileParts.pop();

            if (lastPart) resImport = resImport.slice(0, -1) + `/${lastPart}'`;
          }

          return resImport;
        };

        if (isImportNotFromPublicApi && !isTestingPublicApi) {
          context.report({
            node,
            message: getIndexApiMessage(deepFileLevel),
            fix: (fixer) => {
              return fixer.replaceText(node.source, getFixedImport(deepFileLevel));
            },
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
              messageId: TESTING_INDEX_API,
              fix: (fixer) => {
                return fixer.replaceText(node.source, `'${alias}/${layer}/${slice}/testing'`);
              },
            });
          }
        }
      },
    };
  },
};
