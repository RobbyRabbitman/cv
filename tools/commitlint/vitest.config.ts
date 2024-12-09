import { vitestNodeTypescript } from '@robby-rabbitman/cv-tools-vitest';

export default vitestNodeTypescript({
  test: {
    coverage: {
      enabled: false,
    },
  },
});
