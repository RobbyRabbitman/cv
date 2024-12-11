import { spawnSync } from 'child_process';
import { describe } from 'vitest';
import { getCurrentBranchName } from './git';

vi.mock('child_process');
vi.mock('@nx/devkit', () => ({
  workspaceRoot: '/some/workspace',
}));

describe('[Unit Test] getCurrentBranchName', () => {
  beforeEach(() => {
    vi.mocked(spawnSync).mockReturnValue({
      stdout: 'some-branch-name\n',
      output: [],
      pid: 123,
      signal: null,
      status: 0,
      stderr: '',
    });
  });

  afterEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it('should return the current branch name of the nx workspace', () => {
    getCurrentBranchName();
    expect(spawnSync).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({ cwd: '/some/workspace' }),
    );
  });

  it('should throw an error if the command fails', () => {
    vi.mocked(spawnSync).mockReturnValue({
      output: [],
      pid: 123,
      signal: null,
      status: 1,
      stderr: '',
      stdout: '',
      error: new Error('Oopsie!'),
    });

    expect(() => getCurrentBranchName()).toThrowError(
      '[getCurrentBranchName] Could not get the current branch name',
    );
  });
});
