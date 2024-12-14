import { type Linter } from 'eslint';
import ignoreEslintConfig from './eslint.config.ignore.js';
import jsEslintConfig from './eslint.config.javascript.js';
import nxEslintConfig from './eslint.config.nx.js';
import tsEslintConfig from './eslint.config.typescript.js';

export const baseEslintConfig = [
  ...ignoreEslintConfig,
  ...jsEslintConfig,
  ...tsEslintConfig,
  ...nxEslintConfig,
] satisfies Linter.Config[];

export default baseEslintConfig;
