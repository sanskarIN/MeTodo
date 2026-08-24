/**
 * ============================================================================
 * MeTodo Release Management Dashboard
 * ============================================================================
 * (c) Copyright Sanskar Yadav. All rights reserved.
 * Made by Sanskar Yadav.
 *
 * PURPOSE: Admin dashboard for managing releases and viewing deployment analytics
 *
 * DESCRIPTION:
 * This screen provides comprehensive release management capabilities:
 * - View release history with detailed information
 * - Monitor deployment status across platforms
 * - Track update statistics and adoption rates
 * - Manage staged rollouts
 * - View platform-specific metrics
 * - Access build logs and deployment reports
 * - Manage release channels
 * - Configure auto-rollback triggers
 * - View user feedback on updates
 * - Generate release reports
 *
 * FEATURES:
 * - Release history timeline
 * - Platform-specific deployment status
 * - Real-time update statistics
 * - Adoption rate tracking
 * - Build status monitoring
 * - Staged rollout management
 * - User feedback analytics
 * - Performance metrics
 * - Error tracking
 * - Deployment logs
 *
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { cn } from '@/lib/utils';

interface Release {
  version: string;
  releaseDate: string;
  status: 'draft' | 'beta' | 'stable' | 'deprecated';
  platforms: {
    name: string;
    downloads: number;
    installations: number;
    successRate: number;
    stagedRolloutPercent?: number;
  }[];
  totalDownloads: number;
  totalInstallations: number;
  successRate: number;
  changelog: {
    type: 'feature' | 'bugfix' | 'improvement' | 'security';
    description: string;
  }[];
  releaseNotes: string;
}

interface ReleaseStats {
  totalReleases: number;
  activeReleases: number;
  totalDownloads: number;
  totalInstallations: number;
  averageSuccessRate: number;
  platformStats: Record<string, any>;
}

export default function ReleaseManagementScreen() {
  const colors = useColors();
  const [releases, setReleases] = useState<Release[]>([]);
  const [stats, setStats] = useState<ReleaseStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'beta' | 'stable'>('all');

  useEffect(() => {
    loadReleases();
    loadStats();
  }, []);

  const loadReleases = async () => {
    try {
      // Mock data - in production, fetch from API
      const mockReleases: Release[] = [
        {
          version: '1.2.0',
          releaseDate: '2026-03-01',
          status: 'stable',
          platforms: [
            { name: 'Android', downloads: 30000, installations: 20000, successRate: 0.95 },
            { name: 'iOS', downloads: 25000, installations: 18000, successRate: 0.92 },
            { name: 'Windows', downloads: 15000, installations: 12000, successRate: 0.88 },
            { name: 'Linux', downloads: 8000, installations: 6000, successRate: 0.85 },
            { name: 'macOS', downloads: 2000, installations: 1000, successRate: 0.75 },
          ],
          totalDownloads: 80000,
          totalInstallations: 57000,
          successRate: 0.8875,
          changelog: [
            { type: 'feature', description: 'Added team collaboration features' },
            { type: 'feature', description: 'Added advanced analytics' },
            { type: 'bugfix', description: 'Fixed notification issues' },
            { type: 'security', description: 'Updated security protocols' },
          ],
          releaseNotes: 'Major release with new features and improvements',
        },
        {
          version: '1.1.0',
          releaseDate: '2026-02-01',
          status: 'stable',
          platforms: [
            { name: 'Android', downloads: 45000, installations: 40000, successRate: 0.98 },
            { name: 'iOS', downloads: 35000, installations: 28000, successRate: 0.8 },
            { name: 'Windows', downloads: 25000, installations: 20000, successRate: 0.8 },
            { name: 'Linux', downloads: 10000, installations: 8000, successRate: 0.8 },
            { name: 'macOS', downloads: 5000, installations: 2000, successRate: 0.4 },
          ],
          totalDownloads: 120000,
          totalInstallations: 98000,
          successRate: 0.8167,
          changelog: [
            { type: 'feature', description: 'Added new task filtering options' },
            { type: 'bugfix', description: 'Fixed sync issues on offline mode' },
            { type: 'improvement', description: 'Improved performance' },
          ],
          releaseNotes: 'Bug fixes and improvements',
        },
        {
          version: '1.0.0',
          releaseDate: '2026-01-01',
          status: 'stable',
          platforms: [
            { name: 'Android', downloads: 50000, installations: 40000, successRate: 0.8 },
            { name: 'iOS', downloads: 35000, installations: 28000, successRate: 0.8 },
            { name: 'Windows', downloads: 25000, installations: 20000, successRate: 0.8 },
            { name: 'Linux', downloads: 10000, installations: 8000, successRate: 0.8 },
            { name: 'macOS', downloads: 5000, installations: 2000, successRate: 0.4 },
          ],
          totalDownloads: 125000,
          totalInstallations: 98000,
          successRate: 0.784,
          changelog: [
            { type: 'feature', description: 'Initial release with core features' },
          ],
          releaseNotes: 'Initial release',
        },
      ];

      setReleases(mockReleases);
    } catch (error) {
      console.error('Failed to load releases:', error);
      Alert.alert('Error', 'Failed to load releases');
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Mock data - in production, fetch from API
      const mockStats: ReleaseStats = {
        totalReleases: 3,
        activeReleases: 3,
        totalDownloads: 325000,
        totalInstallations: 253000,
        averageSuccessRate: 0.8274,
        platformStats: {
          android: { downloads: 125000, installations: 100000, successRate: 0.8 },
          ios: { downloads: 95000, installations: 74000, successRate: 0.7789 },
          windows: { downloads: 65000, installations: 52000, successRate: 0.8 },
          linux: { downloads: 28000, installations: 22000, successRate: 0.7857 },
          macos: { downloads: 12000, installations: 5000, successRate: 0.4167 },
        },
      };

      setStats(mockStats);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'stable':
        return colors.success;
      case 'beta':
        return colors.warning;
      case 'draft':
        return colors.muted;
      default:
        return colors.error;
    }
  };

  const getChangelogTypeColor = (type: string) => {
    switch (type) {
      case 'feature':
        return colors.primary;
      case 'bugfix':
        return colors.error;
      case 'improvement':
        return colors.warning;
      case 'security':
        return colors.error;
      default:
        return colors.muted;
    }
  };

  const filteredReleases = releases.filter((release) => {
    if (filter === 'all') return true;
    return release.status === filter;
  });

  if (isLoading) {
    return (
      <ScreenContainer className="bg-background justify-center items-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="p-4 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Release Management</Text>
            <Text className="text-base text-muted">Monitor and manage application releases</Text>
          </View>

          {/* Statistics Overview */}
          {stats && (
            <View className="gap-3">
              <View className="flex-row gap-3">
                <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
                  <Text className="text-sm text-muted">Total Releases</Text>
                  <Text className="text-2xl font-bold text-foreground mt-1">{stats.totalReleases}</Text>
                </View>
                <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
                  <Text className="text-sm text-muted">Total Downloads</Text>
                  <Text className="text-2xl font-bold text-foreground mt-1">
                    {(stats.totalDownloads / 1000).toFixed(0)}K
                  </Text>
                </View>
              </View>
              <View className="flex-row gap-3">
                <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
                  <Text className="text-sm text-muted">Installations</Text>
                  <Text className="text-2xl font-bold text-foreground mt-1">
                    {(stats.totalInstallations / 1000).toFixed(0)}K
                  </Text>
                </View>
                <View className="flex-1 bg-surface rounded-lg p-4 border border-border">
                  <Text className="text-sm text-muted">Success Rate</Text>
                  <Text className="text-2xl font-bold text-foreground mt-1">
                    {(stats.averageSuccessRate * 100).toFixed(1)}%
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Filter Buttons */}
          <View className="flex-row gap-2">
            {(['all', 'active', 'beta', 'stable'] as const).map((filterOption) => (
              <Pressable
                key={filterOption}
                onPress={() => setFilter(filterOption)}
                className={cn(
                  'px-4 py-2 rounded-full border',
                  filter === filterOption
                    ? 'bg-primary border-primary'
                    : 'bg-surface border-border'
                )}
              >
                <Text
                  className={cn(
                    'text-sm font-medium capitalize',
                    filter === filterOption
                      ? 'text-background'
                      : 'text-foreground'
                  )}
                >
                  {filterOption}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Release List */}
          <View className="gap-3">
            {filteredReleases.map((release) => (
              <Pressable
                key={release.version}
                onPress={() => setSelectedRelease(selectedRelease?.version === release.version ? null : release)}
                className="bg-surface rounded-lg border border-border overflow-hidden"
              >
                <View className="p-4 gap-3">
                  {/* Release Header */}
                  <View className="flex-row justify-between items-start gap-2">
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2">
                        <Text className="text-xl font-bold text-foreground">v{release.version}</Text>
                        <View
                          className="px-2 py-1 rounded-full"
                          style={{ backgroundColor: getStatusColor(release.status) + '20' }}
                        >
                          <Text
                            className="text-xs font-semibold capitalize"
                            style={{ color: getStatusColor(release.status) }}
                          >
                            {release.status}
                          </Text>
                        </View>
                      </View>
                      <Text className="text-sm text-muted mt-1">{release.releaseDate}</Text>
                    </View>
                    <Text className="text-lg font-semibold text-primary">
                      {(release.successRate * 100).toFixed(1)}%
                    </Text>
                  </View>

                  {/* Quick Stats */}
                  <View className="flex-row gap-4">
                    <View>
                      <Text className="text-xs text-muted">Downloads</Text>
                      <Text className="text-sm font-semibold text-foreground">
                        {(release.totalDownloads / 1000).toFixed(0)}K
                      </Text>
                    </View>
                    <View>
                      <Text className="text-xs text-muted">Installations</Text>
                      <Text className="text-sm font-semibold text-foreground">
                        {(release.totalInstallations / 1000).toFixed(0)}K
                      </Text>
                    </View>
                    <View>
                      <Text className="text-xs text-muted">Platforms</Text>
                      <Text className="text-sm font-semibold text-foreground">
                        {release.platforms.length}
                      </Text>
                    </View>
                  </View>

                  {/* Expanded Details */}
                  {selectedRelease?.version === release.version && (
                    <View className="gap-3 mt-3 pt-3 border-t border-border">
                      {/* Platform Stats */}
                      <View className="gap-2">
                        <Text className="text-sm font-semibold text-foreground">Platform Breakdown</Text>
                        {release.platforms.map((platform) => (
                          <View key={platform.name} className="gap-1">
                            <View className="flex-row justify-between items-center">
                              <Text className="text-sm text-foreground">{platform.name}</Text>
                              <Text className="text-xs text-muted">
                                {(platform.successRate * 100).toFixed(0)}%
                              </Text>
                            </View>
                            <View className="h-2 bg-border rounded-full overflow-hidden">
                              <View
                                className="h-full bg-primary"
                                style={{ width: `${platform.successRate * 100}%` }}
                              />
                            </View>
                            <Text className="text-xs text-muted">
                              {platform.downloads} downloads, {platform.installations} installations
                            </Text>
                          </View>
                        ))}
                      </View>

                      {/* Changelog */}
                      <View className="gap-2">
                        <Text className="text-sm font-semibold text-foreground">Changelog</Text>
                        {release.changelog.map((item, index) => (
                          <View key={index} className="flex-row gap-2">
                            <View
                              className="w-2 h-2 rounded-full mt-1.5"
                              style={{ backgroundColor: getChangelogTypeColor(item.type) }}
                            />
                            <View className="flex-1">
                              <Text className="text-xs font-semibold text-muted capitalize">
                                {item.type}
                              </Text>
                              <Text className="text-sm text-foreground mt-0.5">
                                {item.description}
                              </Text>
                            </View>
                          </View>
                        ))}
                      </View>

                      {/* Action Buttons */}
                      <View className="flex-row gap-2 mt-2">
                        <Pressable className="flex-1 bg-primary rounded-lg p-3">
                          <Text className="text-sm font-semibold text-background text-center">
                            View Details
                          </Text>
                        </Pressable>
                        <Pressable className="flex-1 bg-surface border border-border rounded-lg p-3">
                          <Text className="text-sm font-semibold text-foreground text-center">
                            View Logs
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  )}
                </View>
              </Pressable>
            ))}
          </View>

          {/* Platform Statistics */}
          {stats && (
            <View className="bg-surface rounded-lg p-4 border border-border gap-3">
              <Text className="text-lg font-semibold text-foreground">Platform Statistics</Text>
              {Object.entries(stats.platformStats).map(([platform, data]) => (
                <View key={platform} className="gap-1">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-sm font-medium text-foreground capitalize">{platform}</Text>
                    <Text className="text-xs text-muted">
                      {(data.successRate * 100).toFixed(0)}% success rate
                    </Text>
                  </View>
                  <View className="h-2 bg-border rounded-full overflow-hidden">
                    <View
                      className="h-full bg-primary"
                      style={{ width: `${data.successRate * 100}%` }}
                    />
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Footer */}
          <View className="pb-4">
            <Text className="text-xs text-muted text-center">
              Last updated: {new Date().toLocaleString()}
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
