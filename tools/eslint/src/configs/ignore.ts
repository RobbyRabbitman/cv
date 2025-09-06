import { type Linter } from 'eslint';

export const ignoreEslintConfig = [
  {
    ignores: [
      'dist/',
      'dist-spec/',
      'build/',
      'node_modules/',
      'tmp/',
      '.storage/',
      'coverage/',
      '.angular/',
      '**/*.timestamp-*',
      '.test-reports/',
    ],
  },
] satisfies Linter.Config[];

export default ignoreEslintConfig;
