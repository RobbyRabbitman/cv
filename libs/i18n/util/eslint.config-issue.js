import nxEslintPlugin from '@nx/eslint-plugin';
import jsoncEslintParser from 'jsonc-eslint-parser';

export default [
  { plugins: { '@nx': nxEslintPlugin } },
  {
    files: ['**/*.json'],
    languageOptions: {
      parser: jsoncEslintParser,
    },
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          // the build targets of this workspace
          buildTargets: ['build-tsc', 'build-angular'],
        },
      ],
    },
  },
];
