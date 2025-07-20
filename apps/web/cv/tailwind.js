import { readCachedProjectGraph, workspaceRoot } from '@nx/devkit';
import { join } from 'path';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    'src/**/*.{html,ts}',
    ...Object.values(readCachedProjectGraph().nodes)
      .map((node) => node.data.root)
      .filter((projectRoot) => /(libs|apps)/.test(projectRoot))
      .map((projectRoot) =>
        join(workspaceRoot, projectRoot, 'src/**/*.{html,ts}'),
      ),
  ],
};
