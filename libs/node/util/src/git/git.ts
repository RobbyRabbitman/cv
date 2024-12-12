import { workspaceRoot } from '@nx/devkit';
import { spawnSync } from 'child_process';

/** Returns the name of the current branch in a nx workspace. */
export function getCurrentBranchName() {
  const result = spawnSync('git', 'branch --show-current'.split(' '), {
    cwd: workspaceRoot,
    encoding: 'utf-8',
  });

  if (result.error) {
    throw new Error(
      '[getCurrentBranchName] Could not get the current branch name',
      { cause: result.error },
    );
  }

  return result.stdout.trim();
}
