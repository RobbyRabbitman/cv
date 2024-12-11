import { spawnSync } from 'child_process';
import { describe, Mock } from 'vitest';
import { getCurrentBranchName } from './git';

vi.mock('child_process');
vi.mock('@nx/devkit', () => ({
  workspaceRoot: '/some/workspace',
}));

describe('[Unit Test] getCurrentBranchName', () => {
  const spawnSyncMock = spawnSync as Mock;

  beforeEach(() => {
    spawnSyncMock.mockReturnValue({
      error: null,
      stdout: 'some-branch-name\n',
    });
  });

  afterEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it('should return the current branch name', () => {
    expect(getCurrentBranchName()).toBe('some-branch-name');
  });

  it('should return the current branch name of the nx workspace', () => {
    getCurrentBranchName();
    expect(spawnSyncMock).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.objectContaining({ cwd: '/some/workspace' }),
    );
  });

  it('should throw an error if the command fails', () => {
    spawnSyncMock.mockReturnValueOnce({
      error: new Error('Oopsie!'),
    });

    expect(() => getCurrentBranchName()).toThrowError(
      '[getCurrentBranchName] Could not get the current branch name',
    );
  });
});
