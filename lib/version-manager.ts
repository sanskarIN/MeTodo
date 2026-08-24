/**
 * ============================================================================
 * MeTodo Version Manager
 * ============================================================================
 * (c) Copyright Sanskar Yadav. All rights reserved.
 * Made by Sanskar Yadav.
 *
 * PURPOSE: Comprehensive version management and release data system
 *
 * DESCRIPTION:
 * This module handles:
 * - Version tracking and comparison
 * - Release data management
 * - Changelog generation
 * - Version history
 * - Semantic versioning
 * - Release notes
 * - Checksum management
 * - Platform-specific versions
 * - Build metadata
 *
 * FEATURES:
 * - Semantic version parsing and comparison
 * - Release channel management (stable, beta, alpha)
 * - Changelog generation from commits
 * - Version history tracking
 * - Platform-specific version management
 * - Checksum verification
 * - Build metadata storage
 * - Version compatibility checking
 * - Migration guides
 *
 * USAGE:
 * import { VersionManager } from '@/lib/version-manager';
 *
 * const manager = new VersionManager();
 * const isNewer = manager.isNewerVersion('1.1.0', '1.0.0');
 * const releases = await manager.getReleases();
 *
 * ============================================================================
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Type definitions
export interface SemanticVersion {
  major: number;
  minor: number;
  patch: number;
  prerelease?: string;
  metadata?: string;
}

export interface ReleaseInfo {
  version: string;
  semanticVersion: SemanticVersion;
  releaseDate: string;
  channel: 'stable' | 'beta' | 'alpha';
  downloadUrls: Record<string, string>;
  checksums: Record<string, ChecksumInfo>;
  fileSizes: Record<string, string>;
  releaseNotes: string;
  changelog: ChangelogEntry[];
  downloads: number;
  rating: number;
  isLatest: boolean;
  buildMetadata: BuildMetadata;
  systemRequirements: Record<string, SystemRequirement[]>;
  installationGuides: Record<string, string[]>;
  migrationGuide?: string;
  breakingChanges?: string[];
  deprecations?: string[];
}

export interface ChecksumInfo {
  sha256: string;
  sha1: string;
  md5: string;
}

export interface ChangelogEntry {
  type: 'feature' | 'bugfix' | 'improvement' | 'breaking' | 'security';
  description: string;
  relatedIssue?: string;
  author?: string;
}

export interface BuildMetadata {
  buildNumber: number;
  buildDate: string;
  gitCommit: string;
  gitBranch: string;
  compiler: string;
  compilerVersion: string;
  buildDuration: number; // in seconds
  buildSize: string;
}

export interface SystemRequirement {
  name: string;
  value: string;
  optional?: boolean;
}

export interface VersionCheckResult {
  hasUpdate: boolean;
  currentVersion: string;
  latestVersion: string;
  releaseChannel: 'stable' | 'beta' | 'alpha';
  releaseInfo?: ReleaseInfo;
  downloadUrl?: string;
  releaseNotes?: string;
  isBreakingChange?: boolean;
}

export interface VersionHistory {
  version: string;
  releaseDate: string;
  downloadCount: number;
  rating: number;
  isLatest: boolean;
}

// Version Manager Class
export class VersionManager {
  private currentVersion: string = '1.0.0';
  private releaseChannel: 'stable' | 'beta' | 'alpha' = 'stable';
  private storageKey = '@metodo_version_info';
  private releaseHistoryKey = '@metodo_release_history';
  private checksumCacheKey = '@metodo_checksum_cache';

  constructor(version?: string, channel?: 'stable' | 'beta' | 'alpha') {
    if (version) this.currentVersion = version;
    if (channel) this.releaseChannel = channel;
  }

  /**
   * Parse semantic version string
   */
  parseVersion(versionString: string): SemanticVersion {
    const match = versionString.match(
      /^(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9.-]+))?(?:\+([a-zA-Z0-9.-]+))?$/
    );

    if (!match) {
      throw new Error(`Invalid semantic version: ${versionString}`);
    }

    return {
      major: parseInt(match[1], 10),
      minor: parseInt(match[2], 10),
      patch: parseInt(match[3], 10),
      prerelease: match[4],
      metadata: match[5],
    };
  }

  /**
   * Format semantic version to string
   */
  formatVersion(version: SemanticVersion): string {
    let result = `${version.major}.${version.minor}.${version.patch}`;
    if (version.prerelease) result += `-${version.prerelease}`;
    if (version.metadata) result += `+${version.metadata}`;
    return result;
  }

  /**
   * Compare two semantic versions
   * Returns: -1 if v1 < v2, 0 if v1 == v2, 1 if v1 > v2
   */
  compareVersions(v1String: string, v2String: string): number {
    const v1 = this.parseVersion(v1String);
    const v2 = this.parseVersion(v2String);

    // Compare major.minor.patch
    if (v1.major !== v2.major) return v1.major > v2.major ? 1 : -1;
    if (v1.minor !== v2.minor) return v1.minor > v2.minor ? 1 : -1;
    if (v1.patch !== v2.patch) return v1.patch > v2.patch ? 1 : -1;

    // Compare prerelease
    if (v1.prerelease && !v2.prerelease) return -1;
    if (!v1.prerelease && v2.prerelease) return 1;
    if (v1.prerelease && v2.prerelease) {
      return v1.prerelease.localeCompare(v2.prerelease);
    }

    return 0;
  }

  /**
   * Check if version1 is newer than version2
   */
  isNewerVersion(v1: string, v2: string): boolean {
    return this.compareVersions(v1, v2) > 0;
  }

  /**
   * Check if version1 is older than version2
   */
  isOlderVersion(v1: string, v2: string): boolean {
    return this.compareVersions(v1, v2) < 0;
  }

  /**
   * Check if versions are equal
   */
  isSameVersion(v1: string, v2: string): boolean {
    return this.compareVersions(v1, v2) === 0;
  }

  /**
   * Get current version
   */
  getCurrentVersion(): string {
    return this.currentVersion;
  }

  /**
   * Set current version
   */
  setCurrentVersion(version: string): void {
    this.parseVersion(version); // Validate
    this.currentVersion = version;
  }

  /**
   * Get release channel
   */
  getReleaseChannel(): 'stable' | 'beta' | 'alpha' {
    return this.releaseChannel;
  }

  /**
   * Set release channel
   */
  setReleaseChannel(channel: 'stable' | 'beta' | 'alpha'): void {
    this.releaseChannel = channel;
  }

  /**
   * Get all releases (mock data - replace with API call)
   */
  async getReleases(): Promise<ReleaseInfo[]> {
    try {
      const cached = await AsyncStorage.getItem(this.releaseHistoryKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.error('Failed to get cached releases:', error);
    }

    // Return mock releases
    return this.getMockReleases();
  }

  /**
   * Get specific release info
   */
  async getReleaseInfo(version: string): Promise<ReleaseInfo | null> {
    const releases = await this.getReleases();
    return releases.find(r => r.version === version) || null;
  }

  /**
   * Get latest release for channel
   */
  async getLatestRelease(channel?: 'stable' | 'beta' | 'alpha'): Promise<ReleaseInfo | null> {
    const releases = await this.getReleases();
    const targetChannel = channel || this.releaseChannel;

    const filtered = releases.filter(r => r.channel === targetChannel);
    if (filtered.length === 0) return null;

    return filtered.reduce((latest, current) =>
      this.compareVersions(current.version, latest.version) > 0 ? current : latest
    );
  }

  /**
   * Check for updates
   */
  async checkForUpdates(
    currentVersion?: string,
    channel?: 'stable' | 'beta' | 'alpha'
  ): Promise<VersionCheckResult> {
    const version = currentVersion || this.currentVersion;
    const targetChannel = channel || this.releaseChannel;

    const latest = await this.getLatestRelease(targetChannel);

    if (!latest) {
      return {
        hasUpdate: false,
        currentVersion: version,
        latestVersion: version,
        releaseChannel: targetChannel,
      };
    }

    const hasUpdate = this.isNewerVersion(latest.version, version);

    return {
      hasUpdate,
      currentVersion: version,
      latestVersion: latest.version,
      releaseChannel: targetChannel,
      releaseInfo: hasUpdate ? latest : undefined,
      downloadUrl: hasUpdate ? latest.downloadUrls.windows : undefined,
      releaseNotes: hasUpdate ? latest.releaseNotes : undefined,
      isBreakingChange: hasUpdate && (latest.breakingChanges?.length || 0) > 0,
    };
  }

  /**
   * Get version history
   */
  async getVersionHistory(limit: number = 10): Promise<VersionHistory[]> {
    const releases = await this.getReleases();
    return releases.slice(0, limit).map(r => ({
      version: r.version,
      releaseDate: r.releaseDate,
      downloadCount: r.downloads,
      rating: r.rating,
      isLatest: r.isLatest,
    }));
  }

  /**
   * Get changelog for version
   */
  async getChangelog(version: string): Promise<ChangelogEntry[]> {
    const release = await this.getReleaseInfo(version);
    return release?.changelog || [];
  }

  /**
   * Get breaking changes for version
   */
  async getBreakingChanges(version: string): Promise<string[]> {
    const release = await this.getReleaseInfo(version);
    return release?.breakingChanges || [];
  }

  /**
   * Get deprecations for version
   */
  async getDeprecations(version: string): Promise<string[]> {
    const release = await this.getReleaseInfo(version);
    return release?.deprecations || [];
  }

  /**
   * Get migration guide
   */
  async getMigrationGuide(fromVersion: string, toVersion: string): Promise<string | null> {
    const release = await this.getReleaseInfo(toVersion);
    return release?.migrationGuide || null;
  }

  /**
   * Verify checksum
   */
  async verifyChecksum(
    version: string,
    platform: string,
    checksum: string,
    type: 'sha256' | 'sha1' | 'md5' = 'sha256'
  ): Promise<boolean> {
    const release = await this.getReleaseInfo(version);
    if (!release) return false;

    const platformChecksums = release.checksums[platform];
    if (!platformChecksums) return false;

    const key = type as keyof ChecksumInfo;
    return platformChecksums[key] === checksum;
  }

  /**
   * Get system requirements for platform
   */
  async getSystemRequirements(
    version: string,
    platform: string
  ): Promise<SystemRequirement[]> {
    const release = await this.getReleaseInfo(version);
    return release?.systemRequirements[platform] || [];
  }

  /**
   * Get installation guide for platform
   */
  async getInstallationGuide(version: string, platform: string): Promise<string[]> {
    const release = await this.getReleaseInfo(version);
    return release?.installationGuides[platform] || [];
  }

  /**
   * Cache release history
   */
  async cacheReleaseHistory(releases: ReleaseInfo[]): Promise<void> {
    try {
      await AsyncStorage.setItem(this.releaseHistoryKey, JSON.stringify(releases));
    } catch (error) {
      console.error('Failed to cache release history:', error);
    }
  }

  /**
   * Clear cache
   */
  async clearCache(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.releaseHistoryKey);
      await AsyncStorage.removeItem(this.checksumCacheKey);
    } catch (error) {
      console.error('Failed to clear cache:', error);
    }
  }

  /**
   * Get mock releases (for development)
   */
  private getMockReleases(): ReleaseInfo[] {
    return [
      {
        version: '1.0.0',
        semanticVersion: { major: 1, minor: 0, patch: 0 },
        releaseDate: '2026-07-02',
        channel: 'stable',
        downloadUrls: {
          android: 'https://play.google.com/store/apps/details?id=space.manus.metodo',
          windows: 'https://metodo.app/downloads/metodo-1.0.0-setup.exe',
          linux: 'https://metodo.app/downloads/metodo-1.0.0.AppImage',
          ios: 'https://apps.apple.com/app/metodo/id1234567890',
          macos: 'https://metodo.app/downloads/metodo-1.0.0.dmg',
        },
        checksums: {
          windows: {
            sha256: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6',
            sha1: 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1',
            md5: 'c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2',
          },
          linux: {
            sha256: 'd4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3',
            sha1: 'e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3d4',
            md5: 'f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3d4e5',
          },
        },
        fileSizes: {
          android: '45 MB',
          windows: '120 MB',
          linux: '110 MB',
          ios: '50 MB',
          macos: '130 MB',
        },
        releaseNotes: 'Initial release with core task management, avatar creator, themes, and developer options',
        changelog: [
          {
            type: 'feature',
            description: 'Core task management system',
            author: 'Sanskar Yadav',
          },
          {
            type: 'feature',
            description: 'Avatar creator with customization',
            author: 'Sanskar Yadav',
          },
          {
            type: 'feature',
            description: '50+ themes system',
            author: 'Sanskar Yadav',
          },
          {
            type: 'feature',
            description: 'Developer options with 30+ tools',
            author: 'Sanskar Yadav',
          },
        ],
        downloads: 15000,
        rating: 4.8,
        isLatest: true,
        buildMetadata: {
          buildNumber: 1,
          buildDate: '2026-07-02T10:00:00Z',
          gitCommit: 'abc123def456',
          gitBranch: 'main',
          compiler: 'TypeScript',
          compilerVersion: '5.9.3',
          buildDuration: 120,
          buildSize: '120 MB',
        },
        systemRequirements: {
          windows: [
            { name: 'OS', value: 'Windows 10 or later' },
            { name: 'RAM', value: '4 GB minimum' },
            { name: 'Storage', value: '500 MB free space' },
          ],
          linux: [
            { name: 'OS', value: 'Ubuntu 18.04+' },
            { name: 'RAM', value: '4 GB minimum' },
            { name: 'Storage', value: '500 MB free space' },
          ],
        },
        installationGuides: {
          windows: [
            'Download the .exe file',
            'Run the installer',
            'Follow the installation wizard',
            'Complete installation',
          ],
          linux: [
            'Download the AppImage file',
            'Make it executable: chmod +x metodo-*.AppImage',
            'Run: ./metodo-*.AppImage',
          ],
        },
      },
    ];
  }
}

// Export singleton instance
export const versionManager = new VersionManager('1.0.0', 'stable');
