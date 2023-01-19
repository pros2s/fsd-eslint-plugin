/**
 * @fileoverview check if absolute paths were imported from deep directories
 * @author Alex
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/public-api-imports'),
  RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
  },
});

const aliasOptions = [
  {
    alias: '@',
  },
];

ruleTester.run('public-api-imports', rule, {
  valid: [
    {
      code: "import { ArticleCodeBlock } from '../ArticleCodeBlock/ArticleCodeBlock'",
      errors: [],
    },
    {
      code: "import { ArticleCodeBlock } from '@/entities/article'",
      errors: [],
      options: aliasOptions,
    },
  ],

  invalid: [
    {
      code: "import { ArticleCodeBlock } from '@/entities/article/ui/ArticleCodeBlock/ArticleCodeBlock'",
      errors: [{ message: 'Absolute paths are allowed only from public api (index.ts)' }],
      options: aliasOptions,
    },
  ],
});
