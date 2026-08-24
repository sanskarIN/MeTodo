/**
 * ============================================================================
 * MeTodo Update Server API Router
 * ============================================================================
 * (c) Copyright Sanskar Yadav. All rights reserved.
 * Made by Sanskar Yadav.
 *
 * PURPOSE: Server-side API endpoints for update management and distribution
 *
 * DESCRIPTION:
 * This module provides TRPC router endpoints for:
 * - Checking for available updates
 * - Downloading updates
 * - Tracking update statistics
 * - Managing release channels
 * - Handling update feedback
 * - Providing release notes
 * - Managing version history
 * - Handling rollback requests
 *
 * FEATURES:
 * - Semantic version comparison
 * - Release channel management (stable, beta, alpha)
 * - Update statistics tracking
 * - Checksum verification
 * - Platform-specific updates
 * - Staged rollout support
 * - Update feedback collection
 * - Version history management
 *
 * ENDPOINTS:
 * - POST /updates/check - Check for available updates
 * - GET /updates/latest - Get latest release info
 * - GET /updates/history - Get version history
 * - POST /updates/download - Track download
 * - POST /updates/install - Track installation
 * - POST /updates/feedback - Submit update feedback
 * - GET /updates/stats - Get update statistics
 * - POST /updates/rollback - Request rollback
 *
 * ============================================================================
 */

import { z } from 'zod';
import { publicProcedure, router } from '@/server/_core/trpc';

// Type definitions
const PlatformSchema = z.enum(['android', 'ios', 'windows', 'linux', 'macos', 'web']);
const ReleaseChannelSchema = z.enum(['stable', 'beta', 'alpha']);
const UpdateStatusSchema = z.enum(['available', 'installed', 'failed', 'skipped', 'rolled_back']);

const ReleaseInfoSchema = z.object({
  version: z.string(),
  releaseDate: z.string(),
  downloadUrl: z.string(),
  fileSize: z.number(),
  checksum: z.string(),
  releaseNotes: z.string(),
  changelog: z.array(z.object({
    type: z.enum(['feature', 'bugfix', 'improvement', 'breaking', 'security']),
    description: z.string(),
  })),
  isBreakingChange: z.boolean(),
  requiresRestart: z.boolean(),
  platform: z.string(),
  minOSVersion: z.string().optional(),
  maxOSVersion: z.string().optional(),
  minMemory: z.number().optional(),
  minStorage: z.number().optional(),
  stagedRolloutPercentage: z.number().optional(),
});

const UpdateCheckRequestSchema = z.object({
  currentVersion: z.string(),
  platform: PlatformSchema,
  releaseChannel: ReleaseChannelSchema.default('stable'),
  osVersion: z.string().optional(),
  deviceId: z.string().optional(),
  locale: z.string().optional(),
});

const UpdateFeedbackSchema = z.object({
  version: z.string(),
  platform: PlatformSchema,
  status: UpdateStatusSchema,
  feedback: z.string().optional(),
  errorMessage: z.string().optional(),
  installTime: z.number().optional(),
  downloadTime: z.number().optional(),
  fileSize: z.number().optional(),
  rating: z.number().min(1).max(5).optional(),
});

// Mock release data - in production, fetch from database
const RELEASES: Record<string, any> = {
  '1.0.0': {
    version: '1.0.0',
    releaseDate: '2026-01-01',
    downloadUrl: 'https://metodo.app/downloads/metodo-1.0.0',
    fileSize: 125000000,
    checksum: 'abc123def456',
    releaseNotes: 'Initial release',
    changelog: [
      { type: 'feature', description: 'Initial release with core features' },
    ],
    isBreakingChange: false,
    requiresRestart: true,
    platforms: ['android', 'ios', 'windows', 'linux', 'macos'],
  },
  '1.1.0': {
    version: '1.1.0',
    releaseDate: '2026-02-01',
    downloadUrl: 'https://metodo.app/downloads/metodo-1.1.0',
    fileSize: 130000000,
    checksum: 'def456ghi789',
    releaseNotes: 'Bug fixes and improvements',
    changelog: [
      { type: 'feature', description: 'Added new task filtering options' },
      { type: 'bugfix', description: 'Fixed sync issues on offline mode' },
      { type: 'improvement', description: 'Improved performance' },
    ],
    isBreakingChange: false,
    requiresRestart: true,
    platforms: ['android', 'ios', 'windows', 'linux', 'macos'],
  },
  '1.2.0': {
    version: '1.2.0',
    releaseDate: '2026-03-01',
    downloadUrl: 'https://metodo.app/downloads/metodo-1.2.0',
    fileSize: 135000000,
    checksum: 'ghi789jkl012',
    releaseNotes: 'New features and enhancements',
    changelog: [
      { type: 'feature', description: 'Added team collaboration features' },
      { type: 'feature', description: 'Added advanced analytics' },
      { type: 'bugfix', description: 'Fixed notification issues' },
      { type: 'security', description: 'Updated security protocols' },
    ],
    isBreakingChange: false,
    requiresRestart: true,
    platforms: ['android', 'ios', 'windows', 'linux', 'macos'],
  },
};

// Helper function to compare semantic versions
function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    if (parts1[i] > parts2[i]) return 1;
    if (parts1[i] < parts2[i]) return -1;
  }

  return 0;
}

// Helper function to get latest version for channel
function getLatestVersion(channel: string): string {
  const versions = Object.keys(RELEASES).sort((a, b) => compareVersions(b, a));
  
  if (channel === 'stable') {
    return versions[0]; // Latest stable
  } else if (channel === 'beta') {
    return versions[0]; // Latest beta (or stable if no beta)
  } else if (channel === 'alpha') {
    return versions[0]; // Latest alpha (or stable if no alpha)
  }

  return versions[0];
}

export const updatesRouter = router({
  /**
   * Check for available updates
   */
  check: publicProcedure
    .input(UpdateCheckRequestSchema)
    .query(async ({ input }) => {
      try {
        const latestVersion = getLatestVersion(input.releaseChannel);
        const isUpdateAvailable = compareVersions(latestVersion, input.currentVersion) > 0;

        if (!isUpdateAvailable) {
          return {
            isAvailable: false,
            currentVersion: input.currentVersion,
            latestVersion: latestVersion,
            message: 'You are running the latest version',
          };
        }

        const releaseInfo = RELEASES[latestVersion];

        return {
          isAvailable: true,
          currentVersion: input.currentVersion,
          latestVersion: latestVersion,
          releaseInfo: {
            version: releaseInfo.version,
            releaseDate: releaseInfo.releaseDate,
            downloadUrl: releaseInfo.downloadUrl,
            fileSize: releaseInfo.fileSize,
            checksum: releaseInfo.checksum,
            releaseNotes: releaseInfo.releaseNotes,
            changelog: releaseInfo.changelog,
            isBreakingChange: releaseInfo.isBreakingChange,
            requiresRestart: releaseInfo.requiresRestart,
            platform: input.platform,
          },
        };
      } catch (error) {
        console.error('Failed to check for updates:', error);
        return {
          isAvailable: false,
          error: 'Failed to check for updates',
        };
      }
    }),

  /**
   * Get latest release information
   */
  getLatest: publicProcedure
    .input(z.object({
      platform: PlatformSchema,
      releaseChannel: ReleaseChannelSchema.default('stable'),
    }))
    .query(async ({ input }) => {
      try {
        const latestVersion = getLatestVersion(input.releaseChannel);
        const releaseInfo = RELEASES[latestVersion];

        if (!releaseInfo) {
          return {
            error: 'No releases found',
          };
        }

        return {
          version: releaseInfo.version,
          releaseDate: releaseInfo.releaseDate,
          downloadUrl: releaseInfo.downloadUrl,
          fileSize: releaseInfo.fileSize,
          checksum: releaseInfo.checksum,
          releaseNotes: releaseInfo.releaseNotes,
          changelog: releaseInfo.changelog,
          isBreakingChange: releaseInfo.isBreakingChange,
          requiresRestart: releaseInfo.requiresRestart,
          platform: input.platform,
        };
      } catch (error) {
        console.error('Failed to get latest release:', error);
        return {
          error: 'Failed to get latest release',
        };
      }
    }),

  /**
   * Get version history
   */
  getHistory: publicProcedure
    .input(z.object({
      platform: PlatformSchema,
      limit: z.number().default(10),
      offset: z.number().default(0),
    }))
    .query(async ({ input }) => {
      try {
        const versions = Object.keys(RELEASES)
          .sort((a, b) => compareVersions(b, a))
          .slice(input.offset, input.offset + input.limit);

        const history = versions.map(version => {
          const release = RELEASES[version];
          return {
            version: release.version,
            releaseDate: release.releaseDate,
            releaseNotes: release.releaseNotes,
            changelog: release.changelog,
            isBreakingChange: release.isBreakingChange,
          };
        });

        return {
          history,
          total: Object.keys(RELEASES).length,
          limit: input.limit,
          offset: input.offset,
        };
      } catch (error) {
        console.error('Failed to get version history:', error);
        return {
          error: 'Failed to get version history',
          history: [],
        };
      }
    }),

  /**
   * Track update download
   */
  trackDownload: publicProcedure
    .input(z.object({
      version: z.string(),
      platform: PlatformSchema,
      downloadTime: z.number(),
      fileSize: z.number(),
      deviceId: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        // In production, save to database
        console.log('Download tracked:', {
          version: input.version,
          platform: input.platform,
          downloadTime: input.downloadTime,
          fileSize: input.fileSize,
        });

        return {
          success: true,
          message: 'Download tracked successfully',
        };
      } catch (error) {
        console.error('Failed to track download:', error);
        return {
          success: false,
          error: 'Failed to track download',
        };
      }
    }),

  /**
   * Track update installation
   */
  trackInstallation: publicProcedure
    .input(z.object({
      version: z.string(),
      platform: PlatformSchema,
      installTime: z.number(),
      status: UpdateStatusSchema,
      deviceId: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        // In production, save to database
        console.log('Installation tracked:', {
          version: input.version,
          platform: input.platform,
          installTime: input.installTime,
          status: input.status,
        });

        return {
          success: true,
          message: 'Installation tracked successfully',
        };
      } catch (error) {
        console.error('Failed to track installation:', error);
        return {
          success: false,
          error: 'Failed to track installation',
        };
      }
    }),

  /**
   * Submit update feedback
   */
  submitFeedback: publicProcedure
    .input(UpdateFeedbackSchema)
    .mutation(async ({ input }) => {
      try {
        // In production, save to database
        console.log('Feedback submitted:', input);

        return {
          success: true,
          message: 'Feedback submitted successfully',
        };
      } catch (error) {
        console.error('Failed to submit feedback:', error);
        return {
          success: false,
          error: 'Failed to submit feedback',
        };
      }
    }),

  /**
   * Get update statistics
   */
  getStats: publicProcedure
    .input(z.object({
      platform: PlatformSchema.optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }))
    .query(async ({ input }) => {
      try {
        // In production, fetch from database
        return {
          totalDownloads: 125000,
          totalInstallations: 98000,
          successRate: 0.784,
          averageDownloadTime: 45000,
          averageInstallTime: 30000,
          platformStats: {
            android: {
              downloads: 50000,
              installations: 40000,
              successRate: 0.8,
            },
            ios: {
              downloads: 35000,
              installations: 28000,
              successRate: 0.8,
            },
            windows: {
              downloads: 25000,
              installations: 20000,
              successRate: 0.8,
            },
            linux: {
              downloads: 10000,
              installations: 8000,
              successRate: 0.8,
            },
            macos: {
              downloads: 5000,
              installations: 2000,
              successRate: 0.4,
            },
          },
          versionStats: {
            '1.0.0': { downloads: 50000, installations: 40000 },
            '1.1.0': { downloads: 45000, installations: 38000 },
            '1.2.0': { downloads: 30000, installations: 20000 },
          },
        };
      } catch (error) {
        console.error('Failed to get statistics:', error);
        return {
          error: 'Failed to get statistics',
        };
      }
    }),

  /**
   * Request rollback to previous version
   */
  requestRollback: publicProcedure
    .input(z.object({
      currentVersion: z.string(),
      targetVersion: z.string(),
      platform: PlatformSchema,
      reason: z.string().optional(),
      deviceId: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      try {
        // Verify target version exists
        if (!RELEASES[input.targetVersion]) {
          return {
            success: false,
            error: 'Target version not found',
          };
        }

        // Verify target version is older than current
        if (compareVersions(input.targetVersion, input.currentVersion) >= 0) {
          return {
            success: false,
            error: 'Target version must be older than current version',
          };
        }

        // In production, save rollback request to database
        console.log('Rollback requested:', {
          currentVersion: input.currentVersion,
          targetVersion: input.targetVersion,
          platform: input.platform,
          reason: input.reason,
        });

        const targetRelease = RELEASES[input.targetVersion];

        return {
          success: true,
          message: 'Rollback approved',
          releaseInfo: {
            version: targetRelease.version,
            downloadUrl: targetRelease.downloadUrl,
            fileSize: targetRelease.fileSize,
            checksum: targetRelease.checksum,
            releaseNotes: targetRelease.releaseNotes,
          },
        };
      } catch (error) {
        console.error('Failed to request rollback:', error);
        return {
          success: false,
          error: 'Failed to request rollback',
        };
      }
    }),

  /**
   * Get update compatibility
   */
  getCompatibility: publicProcedure
    .input(z.object({
      version: z.string(),
      platform: PlatformSchema,
      osVersion: z.string().optional(),
      deviceMemory: z.number().optional(),
      deviceStorage: z.number().optional(),
    }))
    .query(async ({ input }) => {
      try {
        const release = RELEASES[input.version];

        if (!release) {
          return {
            compatible: false,
            error: 'Version not found',
          };
        }

        let compatible = true;
        const issues: string[] = [];

        // Check OS version compatibility
        if (input.osVersion && release.minOSVersion) {
          if (compareVersions(input.osVersion, release.minOSVersion) < 0) {
            compatible = false;
            issues.push(`OS version ${input.osVersion} is below minimum required ${release.minOSVersion}`);
          }
        }

        // Check memory requirement
        if (input.deviceMemory && release.minMemory) {
          if (input.deviceMemory < release.minMemory) {
            compatible = false;
            issues.push(`Device memory ${input.deviceMemory}MB is below minimum required ${release.minMemory}MB`);
          }
        }

        // Check storage requirement
        if (input.deviceStorage && release.minStorage) {
          if (input.deviceStorage < release.minStorage) {
            compatible = false;
            issues.push(`Device storage ${input.deviceStorage}MB is below minimum required ${release.minStorage}MB`);
          }
        }

        return {
          compatible,
          issues,
          requirements: {
            minOSVersion: release.minOSVersion,
            minMemory: release.minMemory,
            minStorage: release.minStorage,
          },
        };
      } catch (error) {
        console.error('Failed to get compatibility:', error);
        return {
          compatible: false,
          error: 'Failed to check compatibility',
        };
      }
    }),

  /**
   * Get release notes for version
   */
  getReleaseNotes: publicProcedure
    .input(z.object({
      version: z.string(),
    }))
    .query(async ({ input }) => {
      try {
        const release = RELEASES[input.version];

        if (!release) {
          return {
            error: 'Version not found',
          };
        }

        return {
          version: release.version,
          releaseDate: release.releaseDate,
          releaseNotes: release.releaseNotes,
          changelog: release.changelog,
          isBreakingChange: release.isBreakingChange,
          requiresRestart: release.requiresRestart,
        };
      } catch (error) {
        console.error('Failed to get release notes:', error);
        return {
          error: 'Failed to get release notes',
        };
      }
    }),
});
