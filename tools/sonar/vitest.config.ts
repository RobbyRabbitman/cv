import { vitestNodeTypescript } from '@robby-rabbitman/cv-tools-vitest';

export default vitestNodeTypescript({
  test: {
    coverage: {
      exclude: ['src/api/sonar.api.ts'],
    },
  },
});
