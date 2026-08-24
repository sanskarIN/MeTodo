#!/usr/bin/env node

/**
 * ============================================================================
 * MeTodo Release Publishing Script
 * ============================================================================
 * (c) Copyright Sanskar Yadav. All rights reserved.
 * Made by Sanskar Yadav.
 *
 * PURPOSE: Publish release information to the Update API
 *
 * DESCRIPTION:
 * This script publishes release information to the backend API,
 * making it available to all clients checking for updates.
 *
 * USAGE:
 * node scripts/publish-release.js --version 1.0.0 --channel stable --notes "Release notes"
 *
 * ============================================================================
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Configuration
const API_ENDPOINT = process.env.API_ENDPOINT || 'https://api.metodo.app';
const API_TOKEN = process.env.API_TOKEN || '';

// Parse command line arguments
const args = process.argv.slice(2);
const options = {};

for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--')) {
    const key = args[i].substring(2);
    const value = args[i + 1];
    options[key] = value;
    i++;
  }
}

const {
  version = '1.0.0',
  channel = 'stable',
  notes = 'Release notes',
} = options;

console.log(`[Release Publisher] Publishing version ${version} to ${channel} channel`);

/**
 * Generate changelog from git history
 */
async function generateChangelog() {
  try {
    const { stdout } = await execAsync(
      'git log --oneline --no-decorate $(git describe --tags --abbrev=0 2>/dev/null || echo "HEAD~10")..HEAD'
    );

    const lines = stdout.trim().split('\n').filter(Boolean);
    const changelog = lines.map((line) => {
      // Parse commit message
      const match = line.match(/^[a-f0-9]+\s+(.+)$/);
      if (!match) return null;

      const message = match[1];
      let type = 'improvement';
      let description = message;

      if (message.startsWith('feat:')) {
        type = 'feature';
        description = message.replace('feat:', '').trim();
      } else if (message.startsWith('fix:')) {
        type = 'bugfix';
        description = message.replace('fix:', '').trim();
      } else if (message.startsWith('security:')) {
        type = 'security';
        description = message.replace('security:', '').trim();
      } else if (message.startsWith('breaking:')) {
        type = 'breaking';
        description = message.replace('breaking:', '').trim();
      }

      return { type, description };
    }).filter(Boolean);

    return changelog;
  } catch (error) {
    console.warn('[Release Publisher] Could not generate changelog:', error.message);
    return [];
  }
}

/**
 * Get file checksums
 */
async function getFileChecksums(directory) {
  const checksums = {};

  try {
    const { stdout } = await execAsync(`find ${directory} -type f -exec sha256sum {} \\;`);
    const lines = stdout.trim().split('\n').filter(Boolean);

    for (const line of lines) {
      const [hash, filePath] = line.split(/\s+/);
      const fileName = path.basename(filePath);
      checksums[fileName] = hash;
    }
  } catch (error) {
    console.warn('[Release Publisher] Could not generate checksums:', error.message);
  }

  return checksums;
}

/**
 * Get file sizes
 */
async function getFileSizes(directory) {
  const sizes = {};

  try {
    const { stdout } = await execAsync(`find ${directory} -type f -exec ls -l {} \\;`);
    const lines = stdout.trim().split('\n').filter(Boolean);

    for (const line of lines) {
      const parts = line.split(/\s+/);
      const size = parseInt(parts[4], 10);
      const filePath = parts.slice(8).join(' ');
      const fileName = path.basename(filePath);
      sizes[fileName] = size;
    }
  } catch (error) {
    console.warn('[Release Publisher] Could not get file sizes:', error.message);
  }

  return sizes;
}

/**
 * Publish release to API
 */
async function publishRelease() {
  try {
    // Generate changelog
    const changelog = await generateChangelog();

    // Get file information
    const artifactDir = 'release-artifacts';
    const checksums = await getFileChecksums(artifactDir);
    const sizes = await getFileSizes(artifactDir);

    // Prepare release data
    const releaseData = {
      version,
      releaseChannel: channel,
      releaseDate: new Date().toISOString(),
      releaseNotes: notes,
      changelog,
      isBreakingChange: changelog.some((item) => item.type === 'breaking'),
      requiresRestart: true,
      platforms: {
        android: {
          downloads: ['metodo-android-apk', 'metodo-android-aab'],
          checksums: {
            apk: checksums['metodo-android-apk'] || '',
            aab: checksums['metodo-android-aab'] || '',
          },
          sizes: {
            apk: sizes['metodo-android-apk'] || 0,
            aab: sizes['metodo-android-aab'] || 0,
          },
        },
        windows: {
          downloads: ['metodo-windows-exe', 'metodo-windows-msi'],
          checksums: {
            exe: checksums['metodo-windows-exe'] || '',
            msi: checksums['metodo-windows-msi'] || '',
          },
          sizes: {
            exe: sizes['metodo-windows-exe'] || 0,
            msi: sizes['metodo-windows-msi'] || 0,
          },
        },
        linux: {
          downloads: ['metodo-linux-appimage', 'metodo-linux-snap', 'metodo-linux-flatpak'],
          checksums: {
            appimage: checksums['metodo-linux-appimage'] || '',
            snap: checksums['metodo-linux-snap'] || '',
            flatpak: checksums['metodo-linux-flatpak'] || '',
          },
          sizes: {
            appimage: sizes['metodo-linux-appimage'] || 0,
            snap: sizes['metodo-linux-snap'] || 0,
            flatpak: sizes['metodo-linux-flatpak'] || 0,
          },
        },
        ios: {
          downloads: ['metodo-ios-ipa'],
          checksums: {
            ipa: checksums['metodo-ios-ipa'] || '',
          },
          sizes: {
            ipa: sizes['metodo-ios-ipa'] || 0,
          },
        },
        macos: {
          downloads: ['metodo-macos-dmg'],
          checksums: {
            dmg: checksums['metodo-macos-dmg'] || '',
          },
          sizes: {
            dmg: sizes['metodo-macos-dmg'] || 0,
          },
        },
      },
    };

    console.log('[Release Publisher] Release data prepared:', JSON.stringify(releaseData, null, 2));

    // Send to API
    const payload = JSON.stringify(releaseData);
    const options = {
      hostname: new URL(API_ENDPOINT).hostname,
      port: 443,
      path: '/api/releases/publish',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        'Authorization': `Bearer ${API_TOKEN}`,
      },
    };

    return new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode === 200 || res.statusCode === 201) {
            console.log('[Release Publisher] Release published successfully');
            console.log('[Release Publisher] Response:', data);
            resolve(true);
          } else {
            console.error('[Release Publisher] Failed to publish release');
            console.error('[Release Publisher] Status:', res.statusCode);
            console.error('[Release Publisher] Response:', data);
            reject(new Error(`HTTP ${res.statusCode}`));
          }
        });
      });

      req.on('error', (error) => {
        console.error('[Release Publisher] Request error:', error);
        reject(error);
      });

      req.write(payload);
      req.end();
    });
  } catch (error) {
    console.error('[Release Publisher] Error:', error);
    throw error;
  }
}

/**
 * Main execution
 */
async function main() {
  try {
    console.log('[Release Publisher] Starting release publication process');
    console.log(`[Release Publisher] Version: ${version}`);
    console.log(`[Release Publisher] Channel: ${channel}`);

    await publishRelease();

    console.log('[Release Publisher] Release publication completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('[Release Publisher] Fatal error:', error);
    process.exit(1);
  }
}

// Run main
main();
