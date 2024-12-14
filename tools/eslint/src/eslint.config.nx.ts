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
        'error',
        {
          buildTargets: ['nx-eslint-dependency-checks-pseudo-build'],
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
      '**/src/**/*.ts',
      '**/src/**/*.mts',
      '**/src/**/*.cts',
      '**/src/**/*.tsx',
      '**/src/**/*.js',
      '**/src/**/*.mjs',
      '**/src/**/*.cjs',
      '**/src/**/*.jsx',
    ],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          depConstraints: [
            /** Types */

            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: ['type:*'],
            },
            {
              sourceTag: 'type:tool',
              onlyDependOnLibsWithTags: ['type:*'],
            },
            {
              sourceTag: 'type:types',
              onlyDependOnLibsWithTags: ['type:types', 'type:util'],
            },
            {
              sourceTag: 'type:types',
              onlyDependOnLibsWithTags: ['type:types', 'type:util'],
            },

            /** Scopes */
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
