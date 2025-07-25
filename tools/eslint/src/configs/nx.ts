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
              sourceTag: 'runtime:node',
              onlyDependOnLibsWithTags: ['runtime:js', 'runtime:node'],
            },
            {
              sourceTag: 'runtime:web',
              onlyDependOnLibsWithTags: ['runtime:js', 'runtime:web'],
            },
          ],
        },
      ],
    },
  },
] as Linter.Config[];

export default nxEslintConfig;
