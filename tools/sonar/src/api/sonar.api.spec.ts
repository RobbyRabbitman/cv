import { beforeEach, describe, expect, it, vi } from 'vitest';
import { sonarApi } from './sonar.api';

describe('sonarApi', () => {
  beforeEach(() => {
    vi.spyOn(global, 'fetch');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('host', () => {
    it('should use https://sonarcloud.io as the default host', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(new Response());

      await sonarApi.project_branches.rename({
        params: {
          project: 'some-project',
          name: 'some-branch',
        },
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching('https://sonarcloud.io'),
        expect.anything(),
      );
    });

    it('should use the provided host', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(new Response());

      await sonarApi.project_branches.rename({
        host: 'https://some-host.io',
        params: {
          project: 'some-project',
          name: 'some-branch',
        },
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching('https://some-host.io'),
        expect.anything(),
      );
    });

    it('should use the provided host environment variable', async () => {
      vi.stubEnv('CV_TOOLS_SONAR_HOST', 'https://some-host.io');

      vi.mocked(fetch).mockResolvedValueOnce(new Response());

      await sonarApi.project_branches.rename({
        params: {
          project: 'some-project',
          name: 'some-branch',
        },
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching('https://some-host.io'),
        expect.anything(),
      );

      vi.unstubAllEnvs();
    });
  });

  describe('auth', () => {
    it('should use the provided token', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(new Response());

      await sonarApi.project_branches.rename({
        params: {
          project: 'some-project',
          name: 'some-branch',
        },
        token: 'some-token',
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer some-token',
          }),
        }),
      );
    });

    it('should use the provided token environment variable', async () => {
      vi.stubEnv('CV_TOOLS_SONAR_TOKEN', 'some-token');

      vi.mocked(fetch).mockResolvedValueOnce(new Response());

      await sonarApi.project_branches.rename({
        params: {
          project: 'some-project',
          name: 'some-branch',
        },
      });

      expect(fetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer some-token',
          }),
        }),
      );

      vi.unstubAllEnvs();
    });
  });

  describe('projects', () => {
    describe('create', () => {
      it('should create a project successfully', async () => {
        const mockResponse = {
          project: {
            key: 'some-key',
            name: 'some-name',
            qualifier: 'TRK',
          },
        };

        vi.mocked(fetch).mockResolvedValueOnce(
          new Response(JSON.stringify(mockResponse)),
        );

        const result = await sonarApi.projects.create({
          params: {
            name: 'some-name',
            project: 'some-project',
            visibility: 'public',
            organization: 'some-org',
          },
        });

        expect(result).toEqual(mockResponse);
        expect(vi.mocked(fetch)).toHaveBeenCalledWith(
          expect.stringMatching('api/projects/create'),
          expect.objectContaining({
            method: 'POST',
          }),
        );
      });

      it('should throw an error if project creation fails', async () => {
        vi.mocked(fetch).mockResolvedValueOnce(
          new Response('Error message', {
            status: 400,
            statusText: 'Bad Request',
          }),
        );

        await expect(
          sonarApi.projects.create({
            params: {
              name: 'some-name',
              project: 'some-project',
              visibility: 'public',
              organization: 'some-org',
            },
          }),
        ).rejects.toThrow(
          'Failed to create project: Bad Request - Error message',
        );
      });
    });

    describe('search', () => {
      it('should search projects successfully', async () => {
        const mockResponse = {
          paging: {
            pageIndex: 1,
            pageSize: 100,
            total: 1,
          },
          components: [
            {
              organization: 'some-org',
              key: 'some-key',
              name: 'some-name',
              qualifier: 'TRK',
              visibility: 'public',
              lastAnalysisDate: '2023-01-01T00:00:00Z',
              revision: '1',
            },
          ],
        };

        vi.mocked(fetch).mockResolvedValueOnce(
          new Response(JSON.stringify(mockResponse)),
        );

        const result = await sonarApi.projects.search({
          params: {
            projects: ['some-project'],
            organization: 'some-org',
          },
        });

        expect(result).toEqual(mockResponse);
        expect(vi.mocked(fetch)).toHaveBeenCalledWith(
          expect.stringMatching('api/projects/search'),
          expect.objectContaining({
            method: 'GET',
          }),
        );
      });

      it('should throw an error if project search fails', async () => {
        vi.mocked(fetch).mockResolvedValueOnce(
          new Response('Error message', {
            status: 404,
            statusText: 'Not Found',
          }),
        );

        await expect(
          sonarApi.projects.search({
            params: {
              projects: ['some-project'],
              organization: 'some-org',
            },
          }),
        ).rejects.toThrow(
          'Failed to search projects: Not Found - Error message',
        );
      });
    });
  });

  describe('project_branches', () => {
    describe('rename', () => {
      it('should rename a project branch successfully', async () => {
        vi.mocked(fetch).mockResolvedValueOnce(new Response());

        await expect(
          sonarApi.project_branches.rename({
            params: {
              name: 'new-branch-name',
              project: 'some-project',
            },
          }),
        ).resolves.not.toThrow();

        expect(vi.mocked(fetch)).toHaveBeenCalledWith(
          expect.stringMatching('api/project_branches/rename'),
          expect.objectContaining({
            method: 'POST',
          }),
        );
      });

      it('should throw an error if branch renaming fails', async () => {
        vi.mocked(fetch).mockResolvedValueOnce(
          new Response('Error message', {
            status: 409,
            statusText: 'Conflict',
          }),
        );

        await expect(
          sonarApi.project_branches.rename({
            params: {
              name: 'new-branch-name',
              project: 'some-project',
            },
          }),
        ).rejects.toThrow(
          'Failed to rename project branch: Conflict - Error message',
        );
      });
    });
  });
});
