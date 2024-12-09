import { RuleConfigSeverity, type UserConfig } from '@commitlint/types';
import { readCachedProjectGraph } from '@nx/devkit';

export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': () => [
      RuleConfigSeverity.Error,
      'always',
      Object.keys(readCachedProjectGraph().nodes),
    ],
  },
} satisfies UserConfig;
