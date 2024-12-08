import { vitestNodeTypescript } from './vitest-config.node-typescript.js';

describe('[Unit Test] vitestNodeTypescript', () => {
  it('should set the test environment to node', () => {
    expect(vitestNodeTypescript().test?.environment).toBe('node');
  });
});
