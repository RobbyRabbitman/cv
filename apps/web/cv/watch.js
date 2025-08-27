import { readCachedProjectGraph, workspaceRoot } from '@nx/devkit';
import { execSync } from 'child_process';
import { join } from 'path';

const project = process.env.NX_TASK_TARGET_PROJECT;

const projects = Object.keys(readCachedProjectGraph().nodes).filter(
  (name) => name !== project,
);

const projectRoot = join(
  workspaceRoot,
  readCachedProjectGraph().nodes[project].data.root,
);

const src = join(projectRoot, 'src');

execSync(
  `nx watch --p ${projects.join(',')} -- "nx run-many -t build-tsc build-ng-packagr -p \\$NX_PROJECT_NAME && touch ${src}/*"`,
);
