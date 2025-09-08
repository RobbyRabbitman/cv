import nxEslintPlguin from '@nx/eslint-plugin';
import { type Linter } from 'eslint';
import jsoncEslintParser from 'jsonc-eslint-parser';
import tsEslint from 'typescript-eslint';
import ignoreEslintConfig from './ignore.js';

export const nxEslintDependencyChecksRuleOptions = {
  ignoredFiles: ['**/{*.config.*,*.spec.*,test-setup.*,tailwind.js}'],
  buildTargets: ['eslint-nx-dependency-checks-pseudo-build'],
};

export const nxEslintConfig = [
  ...ignoreEslintConfig,

  { plugins: { '@nx': nxEslintPlguin } },

  // https://nx.dev/nx-api/eslint-plugin#dependency-checks-rule
  {
    files: ['**/*.json'],
    languageOptions: {
      parser: jsoncEslintParser,
    },
    rules: {
      '@nx/dependency-checks': ['error', nxEslintDependencyChecksRuleOptions],
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
      /**
       * We exlude all config files from the module boundaries checks rule as
       * they are not part of the runtime code because e.g. a web project may
       * depend on a node tool for building or testing.
       */
      '**/vite.config.*',
      '**/vitest.config.*',
      '**/eslint.config.*',
      '**/karma.config.*',
      '**/tailwind.js',
      '**/playwright.config.*',
    ],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          depConstraints: [
            /** Runtime */
            {
              sourceTag: 'runtime:js',
              onlyDependOnLibsWithTags: ['runtime:js'],
            },
            {
              sourceTag: 'runtime:js-mixed',
              onlyDependOnLibsWithTags: [
                'runtime:js-mixed',
                'runtime:js',
                'runtime:node',
                'runtime:web',
              ],
            },
            {
              sourceTag: 'runtime:node',
              onlyDependOnLibsWithTags: [
                'runtime:js',
                'runtime:node',
                'runtime:js-mixed',
              ],
            },
            {
              sourceTag: 'runtime:web',
              onlyDependOnLibsWithTags: [
                'runtime:js',
                'runtime:web',
                'runtime:js-mixed',
              ],
            },
            /** Domain */
            {
              sourceTag: 'domain:common',
              onlyDependOnLibsWithTags: ['domain:common', 'domain:auth'],
            },
            {
              sourceTag: 'domain:auth',
              onlyDependOnLibsWithTags: ['domain:auth', 'domain:common'],
            },
            {
              sourceTag: 'domain:cv',
              onlyDependOnLibsWithTags: [
                'domain:cv',
                'domain:auth',
                'domain:common',
              ],
            },
            /** Type */
            {
              sourceTag: 'type:tool',
              onlyDependOnLibsWithTags: ['type:tool'],
            },
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: [
                'type:feature',
                'type:util',
                'type:types',
                'type:data',
              ],
            },
            {
              sourceTag: 'type:e2e',
              onlyDependOnLibsWithTags: [
                'type:app',
                'type:feature',
                'type:component',
                'type:util',
              ],
            },
            {
              sourceTag: 'type:types',
              onlyDependOnLibsWithTags: ['type:util', 'type:types'],
            },
            {
              sourceTag: 'type:util',
              onlyDependOnLibsWithTags: ['type:util', 'type:types'],
            },
            {
              sourceTag: 'type:data',
              onlyDependOnLibsWithTags: [
                'type:data',
                'type:util',
                'type:types',
              ],
            },
            {
              sourceTag: 'type:component',
              onlyDependOnLibsWithTags: [
                'type:util',
                'type:types',
                'type:data',
                'type:feature',
                'type:component',
              ],
            },
            {
              sourceTag: 'type:feature',
              onlyDependOnLibsWithTags: [
                'type:util',
                'type:types',
                'type:feature',
                'type:data',
                'type:component',
              ],
            },
          ],
        },
      ],
    },
  },
] as Linter.Config[];

export default nxEslintConfig;
