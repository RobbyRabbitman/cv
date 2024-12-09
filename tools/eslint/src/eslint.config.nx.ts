import nxEslintPlugin from '@nx/eslint-plugin';
import { type Linter } from 'eslint';
import jsoncEslintParser from 'jsonc-eslint-parser';
import tsEslint from 'typescript-eslint';
import ignoreConfig from './eslint.config.ignore.js';

const nxEslintConfig = [
  ...ignoreConfig,
  { plugins: { '@nx': nxEslintPlugin } },
  // https://nx.dev/nx-api/eslint-plugin#dependency-checks-rule
  {
    files: ['**/*.json'],
    languageOptions: {
      parser: jsoncEslintParser,
    },
    rules: {
      '@nx/dependency-checks': [
        /**
         * TODO: enable this rule - find out how this rule is supposed to be
         * configured in a pnpm workspace
         */
        'off',
        {
          buildTargets: ['eslint-nx-dependency-checks-pseudo-build'],
        },
      ],
    },
  },
  // https://nx.dev/nx-api/eslint-plugin#enforce-module-boundaries-rule
  {
    files: ['**/*.ts', '**/*.mts', '**/*.cts', '**/*.tsx'],
    languageOptions: {
      parser: tsEslint.parser,
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.mts',
      '**/*.cts',
      '**/*.tsx',
      '**/*.js',
      '**/*.mjs',
      '**/*.cjs',
      '**/*.jsx',
    ],
    ignores: [
      '**/vite.config.*',
      '**/vitest.config.*',
      '**/wtr.config.*',
      '**/eslint.config.*',
      '**/stylelint.config.*',
    ],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            // types
            {
              sourceTag: 'type:lib',
              onlyDependOnLibsWithTags: [
                'type:lib',
                'type:assets',
                'type:tokens',
                'type:util',
                'type:storybook',
                'type:tool',
              ],
            },
            {
              sourceTag: 'type:storybook',
              onlyDependOnLibsWithTags: [
                'type:storybook',
                'type:util',
                'type:tool',
                'type:lib',

                'scope:node',
                'scope:web',
              ],
            },
            {
              sourceTag: 'type:tokens',
              onlyDependOnLibsWithTags: ['type:tokens', 'type:tool'],
            },
            {
              sourceTag: 'type:assets',
              onlyDependOnLibsWithTags: ['type:assets', 'type:tool'],
            },
            {
              sourceTag: 'type:util',
              onlyDependOnLibsWithTags: ['type:util', 'type:tool'],
            },
            {
              sourceTag: 'type:tool',
              onlyDependOnLibsWithTags: ['type:util', 'type:tool'],
            },
            // scopes
            {
              sourceTag: 'scope:js',
              onlyDependOnLibsWithTags: ['scope:js'],
            },
            {
              sourceTag: 'scope:node',
              onlyDependOnLibsWithTags: ['scope:js', 'scope:node'],
            },
            {
              sourceTag: 'scope:web',
              onlyDependOnLibsWithTags: ['scope:js', 'scope:web'],
            },
            {
              sourceTag: 'scope:angular',
              onlyDependOnLibsWithTags: [
                'scope:js',
                'scope:web',
                'scope:angular',
              ],
            },
          ],
        },
      ],
    },
  },
] as Linter.Config[];

export default nxEslintConfig;
