/**
 * ============================================================================
 * MeTodo Update Settings Screen
 * ============================================================================
 * (c) Copyright Sanskar Yadav. All rights reserved.
 * Made by Sanskar Yadav.
 *
 * PURPOSE: UI screen for managing update preferences and auto-update configuration
 *
 * DESCRIPTION:
 * This screen provides a comprehensive interface for users to:
 * - Enable/disable automatic update checking
 * - Configure update frequency
 * - Select release channel (stable, beta, alpha)
 * - Configure network preferences (WiFi/cellular)
 * - Set minimum battery level for updates
 * - View update history
 * - Check for updates manually
 * - Configure auto-install behavior
 * - View current version information
 * - Access update statistics
 *
 * FEATURES:
 * - Toggle auto-update checking
 * - Configurable check interval
 * - Release channel selection
 * - Network type preferences
 * - Battery level configuration
 * - Manual update checking
 * - Update history display
 * - Version information
 * - Update statistics
 * - Settings persistence
 *
 * ============================================================================
 */

import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  Switch,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useColors } from '@/hooks/use-colors';
import { autoUpdateService } from '@/lib/auto-update-service';
import { cn } from '@/lib/utils';

interface UpdateSettings {
  enableAutoCheck: boolean;
  checkInterval: number;
  releaseChannel: 'stable' | 'beta' | 'alpha';
  checkOnWifi: boolean;
  checkOnCellular: boolean;
  minBatteryPercent: number;
  autoInstall: boolean;
  notifyUser: boolean;
}

interface UpdateStatus {
  isAvailable: boolean;
  currentVersion: string;
  latestVersion: string;
  lastCheckTime: number;
  nextCheckTime: number;
  isDownloading: boolean;
  downloadProgress: number;
}

export default function UpdateSettingsScreen() {
  const colors = useColors();
  const [settings, setSettings] = useState<UpdateSettings>({
    enableAutoCheck: true,
    checkInterval: 86400000,
    releaseChannel: 'stable',
    checkOnWifi: true,
    checkOnCellular: false,
    minBatteryPercent: 20,
    autoInstall: false,
    notifyUser: true,
  });

  const [updateStatus, setUpdateStatus] = useState<UpdateStatus>({
    isAvailable: false,
    currentVersion: '1.0.0',
    latestVersion: '1.0.0',
    lastCheckTime: 0,
    nextCheckTime: 0,
    isDownloading: false,
    downloadProgress: 0,
  });

  const [isCheckingForUpdates, setIsCheckingForUpdates] = useState(false);

  useEffect(() => {
    loadSettings();
    loadUpdateStatus();
  }, []);

  const loadSettings = async () => {
    try {
      const config = autoUpdateService.getConfig();
      setSettings({
        enableAutoCheck: config.enableAutoCheck,
        checkInterval: config.checkInterval,
        releaseChannel: config.releaseChannel,
        checkOnWifi: config.checkOnWifi,
        checkOnCellular: config.checkOnCellular,
        minBatteryPercent: config.minBatteryPercent,
        autoInstall: config.autoInstall,
        notifyUser: config.notifyUser,
      });
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const loadUpdateStatus = async () => {
    try {
      const status = autoUpdateService.getUpdateStatus();
      setUpdateStatus({
        isAvailable: status.isAvailable,
        currentVersion: status.currentVersion,
        latestVersion: status.latestVersion,
        lastCheckTime: status.lastCheckTime,
        nextCheckTime: status.nextCheckTime,
        isDownloading: status.isDownloading,
        downloadProgress: status.downloadProgress,
      });
    } catch (error) {
      console.error('Failed to load update status:', error);
    }
  };

  const handleSettingChange = async (key: keyof UpdateSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);

    try {
      await autoUpdateService.updateConfig({
        [key]: value,
      });
    } catch (error) {
      console.error('Failed to update setting:', error);
      Alert.alert('Error', 'Failed to update setting');
    }
  };

  const handleCheckForUpdates = async () => {
    setIsCheckingForUpdates(true);
    try {
      const status = await autoUpdateService.checkForUpdates();
      setUpdateStatus({
        isAvailable: status.isAvailable,
        currentVersion: status.currentVersion,
        latestVersion: status.latestVersion,
        lastCheckTime: status.lastCheckTime,
        nextCheckTime: status.nextCheckTime,
        isDownloading: status.isDownloading,
        downloadProgress: status.downloadProgress,
      });

      if (status.isAvailable) {
        Alert.alert(
          'Update Available',
          `Version ${status.latestVersion} is available. Would you like to download it?`,
          [
            { text: 'Later', onPress: () => {} },
            {
              text: 'Download',
              onPress: () => {
                if (status.updateInfo) {
                  autoUpdateService.downloadUpdate(status.updateInfo);
                }
              },
            },
          ]
        );
      } else {
        Alert.alert('No Updates', 'You are running the latest version');
      }
    } catch (error) {
      console.error('Failed to check for updates:', error);
      Alert.alert('Error', 'Failed to check for updates');
    } finally {
      setIsCheckingForUpdates(false);
    }
  };

  const formatDate = (timestamp: number) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleString();
  };

  const formatCheckInterval = (ms: number) => {
    const hours = ms / (1000 * 60 * 60);
    if (hours < 24) return `${Math.round(hours)} hours`;
    return `${Math.round(hours / 24)} days`;
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="p-4 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Update Settings</Text>
            <Text className="text-base text-muted">Configure how MeTodo checks and installs updates</Text>
          </View>

          {/* Current Version Section */}
          <View className="bg-surface rounded-lg p-4 gap-3 border border-border">
            <Text className="text-lg font-semibold text-foreground">Current Version</Text>
            <View className="flex-row justify-between items-center">
              <Text className="text-base text-muted">Version</Text>
              <Text className="text-base font-semibold text-foreground">{updateStatus.currentVersion}</Text>
            </View>
            {updateStatus.latestVersion !== updateStatus.currentVersion && (
              <View className="flex-row justify-between items-center">
                <Text className="text-base text-muted">Latest Version</Text>
                <Text className="text-base font-semibold text-primary">{updateStatus.latestVersion}</Text>
              </View>
            )}
            <View className="flex-row justify-between items-center">
              <Text className="text-base text-muted">Last Checked</Text>
              <Text className="text-sm text-muted">{formatDate(updateStatus.lastCheckTime)}</Text>
            </View>
          </View>

          {/* Auto-Update Toggle */}
          <View className="bg-surface rounded-lg p-4 gap-3 border border-border">
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-lg font-semibold text-foreground">Auto-Update Checking</Text>
                <Text className="text-sm text-muted mt-1">Automatically check for updates</Text>
              </View>
              <Switch
                value={settings.enableAutoCheck}
                onValueChange={(value) => handleSettingChange('enableAutoCheck', value)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={settings.enableAutoCheck ? colors.primary : colors.muted}
              />
            </View>
          </View>

          {/* Check Interval */}
          {settings.enableAutoCheck && (
            <View className="bg-surface rounded-lg p-4 gap-3 border border-border">
              <Text className="text-lg font-semibold text-foreground">Check Frequency</Text>
              <Text className="text-sm text-muted">Currently checking every {formatCheckInterval(settings.checkInterval)}</Text>
              <View className="gap-2">
                {[
                  { label: '1 hour', value: 3600000 },
                  { label: '6 hours', value: 21600000 },
                  { label: '12 hours', value: 43200000 },
                  { label: '24 hours', value: 86400000 },
                  { label: '7 days', value: 604800000 },
                ].map((option) => (
                  <Pressable
                    key={option.value}
                    onPress={() => handleSettingChange('checkInterval', option.value)}
                    className={cn(
                      'p-3 rounded-lg border',
                      settings.checkInterval === option.value
                        ? 'bg-primary border-primary'
                        : 'bg-background border-border'
                    )}
                  >
                    <Text
                      className={cn(
                        'text-base font-medium',
                        settings.checkInterval === option.value
                          ? 'text-background'
                          : 'text-foreground'
                      )}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Release Channel */}
          <View className="bg-surface rounded-lg p-4 gap-3 border border-border">
            <Text className="text-lg font-semibold text-foreground">Release Channel</Text>
            <View className="gap-2">
              {[
                { label: 'Stable', value: 'stable', description: 'Production-ready releases' },
                { label: 'Beta', value: 'beta', description: 'Pre-release testing' },
                { label: 'Alpha', value: 'alpha', description: 'Early development versions' },
              ].map((option) => (
                <Pressable
                  key={option.value}
                  onPress={() => handleSettingChange('releaseChannel', option.value)}
                  className={cn(
                    'p-3 rounded-lg border',
                    settings.releaseChannel === option.value
                      ? 'bg-primary border-primary'
                      : 'bg-background border-border'
                  )}
                >
                  <Text
                    className={cn(
                      'text-base font-medium',
                      settings.releaseChannel === option.value
                        ? 'text-background'
                        : 'text-foreground'
                    )}
                  >
                    {option.label}
                  </Text>
                  <Text
                    className={cn(
                      'text-sm mt-1',
                      settings.releaseChannel === option.value
                        ? 'text-background opacity-80'
                        : 'text-muted'
                    )}
                  >
                    {option.description}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Network Preferences */}
          <View className="bg-surface rounded-lg p-4 gap-3 border border-border">
            <Text className="text-lg font-semibold text-foreground">Network Preferences</Text>
            <View className="gap-3">
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-base text-foreground">Check on WiFi</Text>
                  <Text className="text-sm text-muted mt-1">Download updates over WiFi</Text>
                </View>
                <Switch
                  value={settings.checkOnWifi}
                  onValueChange={(value) => handleSettingChange('checkOnWifi', value)}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={settings.checkOnWifi ? colors.primary : colors.muted}
                />
              </View>
              <View className="h-px bg-border" />
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-base text-foreground">Check on Cellular</Text>
                  <Text className="text-sm text-muted mt-1">Download updates over cellular data</Text>
                </View>
                <Switch
                  value={settings.checkOnCellular}
                  onValueChange={(value) => handleSettingChange('checkOnCellular', value)}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={settings.checkOnCellular ? colors.primary : colors.muted}
                />
              </View>
            </View>
          </View>

          {/* Battery Level */}
          <View className="bg-surface rounded-lg p-4 gap-3 border border-border">
            <Text className="text-lg font-semibold text-foreground">Minimum Battery Level</Text>
            <Text className="text-base text-muted">Only update when battery is above {settings.minBatteryPercent}%</Text>
            <View className="gap-2 mt-2">
              {[10, 20, 30, 50].map((percent) => (
                <Pressable
                  key={percent}
                  onPress={() => handleSettingChange('minBatteryPercent', percent)}
                  className={cn(
                    'p-3 rounded-lg border',
                    settings.minBatteryPercent === percent
                      ? 'bg-primary border-primary'
                      : 'bg-background border-border'
                  )}
                >
                  <Text
                    className={cn(
                      'text-base font-medium',
                      settings.minBatteryPercent === percent
                        ? 'text-background'
                        : 'text-foreground'
                    )}
                  >
                    {percent}%
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Installation Preferences */}
          <View className="bg-surface rounded-lg p-4 gap-3 border border-border">
            <Text className="text-lg font-semibold text-foreground">Installation Preferences</Text>
            <View className="gap-3">
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-base text-foreground">Auto-Install Updates</Text>
                  <Text className="text-sm text-muted mt-1">Automatically install downloaded updates</Text>
                </View>
                <Switch
                  value={settings.autoInstall}
                  onValueChange={(value) => handleSettingChange('autoInstall', value)}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={settings.autoInstall ? colors.primary : colors.muted}
                />
              </View>
              <View className="h-px bg-border" />
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-base text-foreground">Notify User</Text>
                  <Text className="text-sm text-muted mt-1">Show notification when updates are available</Text>
                </View>
                <Switch
                  value={settings.notifyUser}
                  onValueChange={(value) => handleSettingChange('notifyUser', value)}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={settings.notifyUser ? colors.primary : colors.muted}
                />
              </View>
            </View>
          </View>

          {/* Manual Update Check */}
          <Pressable
            onPress={handleCheckForUpdates}
            disabled={isCheckingForUpdates}
            className={cn(
              'p-4 rounded-lg flex-row items-center justify-center gap-2',
              isCheckingForUpdates ? 'bg-muted opacity-50' : 'bg-primary'
            )}
          >
            {isCheckingForUpdates ? (
              <>
                <ActivityIndicator color={colors.background} />
                <Text className="text-base font-semibold text-background">Checking for Updates...</Text>
              </>
            ) : (
              <Text className="text-base font-semibold text-background">Check for Updates Now</Text>
            )}
          </Pressable>

          {/* Update Status */}
          {updateStatus.isAvailable && (
            <View className="bg-primary bg-opacity-10 rounded-lg p-4 border border-primary">
              <Text className="text-lg font-semibold text-primary">Update Available</Text>
              <Text className="text-base text-foreground mt-2">
                Version {updateStatus.latestVersion} is available
              </Text>
              {updateStatus.isDownloading && (
                <View className="mt-3 gap-2">
                  <View className="h-2 bg-border rounded-full overflow-hidden">
                    <View
                      className="h-full bg-primary"
                      style={{ width: `${updateStatus.downloadProgress}%` }}
                    />
                  </View>
                  <Text className="text-sm text-muted">{updateStatus.downloadProgress}% downloaded</Text>
                </View>
              )}
            </View>
          )}

          {/* Next Check Time */}
          {settings.enableAutoCheck && (
            <View className="bg-surface rounded-lg p-4 border border-border">
              <Text className="text-sm text-muted">Next check scheduled for</Text>
              <Text className="text-base font-semibold text-foreground mt-1">
                {formatDate(updateStatus.nextCheckTime)}
              </Text>
            </View>
          )}

          {/* Footer */}
          <View className="pb-4">
            <Text className="text-xs text-muted text-center">
              MeTodo automatically checks for updates and keeps you informed about new features and security patches.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
