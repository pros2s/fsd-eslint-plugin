/**
 * @fileoverview feature sliced design layers imports rules
 * @author Alex
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/fsd-layer-imports'),
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

ruleTester.run('fsd-layer-imports', rule, {
  valid: [
    {
      filename: 'D:\\vs\\react\\middle-project\\src\\app\\file.ts',
      code: "import { ArticleCodeBlock } from '@/pages/some.ts'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'D:\\vs\\react\\middle-project\\src\\pages\\file.ts',
      code: "import { ArticleCodeBlock } from '@/widgets/some.ts'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'D:\\vs\\react\\middle-project\\src\\widgets\\file.ts',
      code: "import { ArticleCodeBlock } from '@/features/some.ts'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'D:\\vs\\react\\middle-project\\src\\features\\file.ts',
      code: "import { ArticleCodeBlock } from '@/entities/some.ts'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'D:\\vs\\react\\middle-project\\src\\entities\\file.ts',
      code: "import { ArticleCodeBlock } from '@/entities/some.ts'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'D:\\vs\\react\\middle-project\\src\\entities\\file.ts',
      code: "import { ArticleCodeBlock } from '@/shared/some.ts'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'D:\\vs\\react\\middle-project\\src\\shared\\file.ts',
      code: "import { ArticleCodeBlock } from '@/shared/some.ts'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'D:\\vs\\react\\middle-project\\src\\app\\file.ts',
      code: "import { ArticleCodeBlock } from 'redux'",
      errors: [],
      options: aliasOptions,
    },
    {
      filename: 'D:\\vs\\react\\middle-project\\src\\features\\file.ts',
      code: "import { ArticleCodeBlock } from '@/app/StoreProvider.ts'",
      errors: [],
      options: [{ ...aliasOptions, ignoreFilesPatterns: ['**/StoreProvider.*'] }],
    },
  ],

  invalid: [
    {
      filename: 'D:\\vs\\react\\middle-project\\src\\features\\file.ts',
      code: "import { ArticleCodeBlock } from '@/pages/some.ts'",
      errors: [
        {
          message:
            "A layer can only import underlying layers into itself (app -> pages -> widgets -> features -> entities(it's ok) -> shared)",
        },
      ],
      options: aliasOptions,
    },
    {
      filename: 'D:\\vs\\react\\middle-project\\src\\shared\\file.ts',
      code: "import { ArticleCodeBlock } from '@/app/some.ts'",
      errors: [
        {
          message:
            "A layer can only import underlying layers into itself (app -> pages -> widgets -> features -> entities(it's ok) -> shared)",
        },
      ],
      options: aliasOptions,
    },
  ],
});
