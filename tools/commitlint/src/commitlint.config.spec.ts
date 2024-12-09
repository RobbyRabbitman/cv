import { readCachedProjectGraph, workspaceRoot } from '@nx/devkit';
import { execSync, type SpawnSyncReturns } from 'child_process';

describe('[Integration Test] commits of this repository', () => {
  const commitlintProjectName = process.env.NX_TASK_TARGET_PROJECT;

  if (!commitlintProjectName) {
    throw new Error(
      'NX_TASK_TARGET_PROJECT is not set - this is expected to be run as a nx task.',
    );
  }

  const commitlint = (commitMessage: string) =>
    execSync(`pnpm nx run ${commitlintProjectName}:commitlint`, {
      cwd: workspaceRoot,
      encoding: 'utf-8',
      env: {
        ...process.env,
        CV_TOOLS_COMMITLINT_TEXT: commitMessage,
      },
    });

  it('should follow conventional format', () => {
    const validTypes = [
      'build',
      'ci',
      'chore',
      'docs',
      'feat',
      'fix',
      'perf',
      'refactor',
      'revert',
      'style',
      'test',
    ];

    try {
      commitlint(`not_a_valid_type: type that does not exist`);
    } catch (error) {
      for (const validType of validTypes) {
        expect((error as SpawnSyncReturns<string>).stdout).toMatch(
          new RegExp(`type must be one of \\[.*${validType}.*\\]`),
        );
      }

      return;
    }

    expect.fail();
  });

  it('should reference projects when scoped', () => {
    const projects = Object.keys(readCachedProjectGraph().nodes);

    expect(projects.length).toBeGreaterThan(0);

    try {
      commitlint('feat(not-a-project): supa dupa feature');
    } catch (error) {
      for (const project of projects) {
        expect((error as SpawnSyncReturns<string>).stdout).toMatch(
          new RegExp(`scope must be one of \\[.*${project}.*\\]`),
        );
      }

      return;
    }

    expect.fail();
  });
});
