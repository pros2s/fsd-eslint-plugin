/**
 * @fileoverview fsd relative paths watcher
 * @author Alex
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/path-watcher'),
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
ruleTester.run('path-watcher', rule, {
  valid: [
    {
      filename: 'D:\\vs\\react\\middle-project\\src\\entities\\article\\ui\\ArticleDetails',
      code: "import { ArticleCodeBlock } from '../ArticleCodeBlock/ArticleCodeBlock'",
      errors: [],
    },
  ],

  invalid: [
    {
      filename: 'D:\\vs\\react\\middle-project\\src\\entities\\article\\ui\\ArticleDetails',
      code: "import { ArticleCodeBlock } from '@/entities/article/ui/ArticleCodeBlock/ArticleCodeBlock'",
      errors: [{ message: 'Inside one slice paths should be relative' }],
      options: [
        {
          alias: '@',
        },
      ],
    },
    {
      filename: 'D:\\vs\\react\\middle-project\\src\\entities\\article\\ui\\ArticleDetails',
      code: "import { ArticleCodeBlock } from 'entities/article/ui/ArticleCodeBlock/ArticleCodeBlock'",
      errors: [{ message: 'Inside one slice paths should be relative' }],
    },
  ],
});
