/**
 * =============================================================================
 * (c) Copyright Sanskar Yadav. All rights reserved.
 * Made by Sanskar Yadav.
 * =============================================================================
 *
 * FILE: scripts/ci-cd-pipeline.ts
 * PURPOSE: CI/CD pipeline configuration for automated builds and deployments
 *
 * DESCRIPTION:
 * This file contains comprehensive CI/CD pipeline configuration including:
 * - GitHub Actions workflows
 * - Build automation
 * - Testing automation
 * - Deployment automation
 * - Release management
 * - Version management
 * - Artifact management
 * - Notification configuration
 *
 * FEATURES:
 * - Automated builds for all platforms
 * - Automated testing
 * - Automated deployments
 * - Release automation
 * - Artifact management
 * - Notification system
 * - Rollback capability
 * - Performance monitoring
 *
 * DEPENDENCIES:
 * - GitHub Actions
 * - EAS Build
 * - Fastlane
 * - Electron Builder
 *
 * =============================================================================
 */

/**
 * CI/CD Pipeline Configuration
 */
export const cicdPipelineConfig = {
  /**
   * GitHub Actions workflows
   */
  workflows: {
    /**
     * Build workflow
     */
    build: {
      name: "Build",
      on: {
        push: {
          branches: ["main", "develop"],
          paths: [
            "app/**",
            "server/**",
            "lib/**",
            "package.json",
            "pnpm-lock.yaml",
            ".github/workflows/build.yml",
          ],
        },
        pull_request: {
          branches: ["main", "develop"],
        },
      },
      jobs: {
        build: {
          "runs-on": "ubuntu-latest",
          strategy: {
            matrix: {
              node: ["18", "20"],
            },
          },
          steps: [
            {
              uses: "actions/checkout@v4",
            },
            {
              uses: "pnpm/action-setup@v2",
              with: {
                version: "9.12.0",
              },
            },
            {
              uses: "actions/setup-node@v4",
              with: {
                "node-version": "${{ matrix.node }}",
                "cache": "pnpm",
              },
            },
            {
              run: "pnpm install",
            },
            {
              run: "pnpm run check",
            },
            {
              run: "pnpm run lint",
            },
            {
              run: "pnpm run test",
            },
          ],
        },
      },
    },

    /**
     * Android build workflow
     */
    androidBuild: {
      name: "Android Build",
      on: {
        push: {
          branches: ["main"],
          tags: ["v*"],
        },
      },
      jobs: {
        build: {
          "runs-on": "ubuntu-latest",
          steps: [
            {
              uses: "actions/checkout@v4",
            },
            {
              uses: "pnpm/action-setup@v2",
              with: {
                version: "9.12.0",
              },
            },
            {
              uses: "actions/setup-node@v4",
              with: {
                "node-version": "20",
                "cache": "pnpm",
              },
            },
            {
              uses: "actions/setup-java@v3",
              with: {
                "distribution": "temurin",
                "java-version": "17",
              },
            },
            {
              run: "pnpm install",
            },
            {
              run: "pnpm run build",
            },
            {
              name: "Build Android",
              run: "eas build --platform android --non-interactive",
              env: {
                EAS_TOKEN: "${{ secrets.EAS_TOKEN }}",
              },
            },
            {
              name: "Upload to Google Play",
              run: "fastlane android deploy",
              env: {
                ANDROID_JSON_KEY: "${{ secrets.ANDROID_JSON_KEY }}",
              },
            },
          ],
        },
      },
    },

    /**
     * Windows build workflow
     */
    windowsBuild: {
      name: "Windows Build",
      on: {
        push: {
          branches: ["main"],
          tags: ["v*"],
        },
      },
      jobs: {
        build: {
          "runs-on": "windows-latest",
          steps: [
            {
              uses: "actions/checkout@v4",
            },
            {
              uses: "pnpm/action-setup@v2",
              with: {
                version: "9.12.0",
              },
            },
            {
              uses: "actions/setup-node@v4",
              with: {
                "node-version": "20",
                "cache": "pnpm",
              },
            },
            {
              run: "pnpm install",
            },
            {
              run: "pnpm run build",
            },
            {
              name: "Build Windows",
              run: "npm run electron:build -- --win",
              env: {
                WIN_CERTIFICATE_FILE: "${{ secrets.WIN_CERTIFICATE_FILE }}",
                WIN_CERTIFICATE_PASSWORD: "${{ secrets.WIN_CERTIFICATE_PASSWORD }}",
              },
            },
            {
              name: "Upload artifacts",
              uses: "actions/upload-artifact@v3",
              with: {
                name: "windows-builds",
                path: "dist/windows/**/*.exe",
              },
            },
          ],
        },
      },
    },

    /**
     * Linux build workflow
     */
    linuxBuild: {
      name: "Linux Build",
      on: {
        push: {
          branches: ["main"],
          tags: ["v*"],
        },
      },
      jobs: {
        build: {
          "runs-on": "ubuntu-latest",
          steps: [
            {
              uses: "actions/checkout@v4",
            },
            {
              uses: "pnpm/action-setup@v2",
              with: {
                version: "9.12.0",
              },
            },
            {
              uses: "actions/setup-node@v4",
              with: {
                "node-version": "20",
                "cache": "pnpm",
              },
            },
            {
              run: "pnpm install",
            },
            {
              run: "pnpm run build",
            },
            {
              name: "Build Linux",
              run: "npm run electron:build -- --linux",
            },
            {
              name: "Upload artifacts",
              uses: "actions/upload-artifact@v3",
              with: {
                name: "linux-builds",
                path: "dist/linux/**/*.AppImage",
              },
            },
          ],
        },
      },
    },

    /**
     * Release workflow
     */
    release: {
      name: "Release",
      on: {
        push: {
          tags: ["v*"],
        },
      },
      jobs: {
        release: {
          "runs-on": "ubuntu-latest",
          steps: [
            {
              uses: "actions/checkout@v4",
            },
            {
              name: "Create Release",
              uses: "actions/create-release@v1",
              env: {
                GITHUB_TOKEN: "${{ secrets.GITHUB_TOKEN }}",
              },
              with: {
                tag_name: "${{ github.ref }}",
                release_name: "Release ${{ github.ref }}",
                draft: false,
                prerelease: false,
              },
            },
            {
              name: "Publish to npm",
              run: "npm publish",
              env: {
                NPM_TOKEN: "${{ secrets.NPM_TOKEN }}",
              },
            },
          ],
        },
      },
    },

    /**
     * Deploy workflow
     */
    deploy: {
      name: "Deploy",
      on: {
        push: {
          branches: ["main"],
        },
      },
      jobs: {
        deploy: {
          "runs-on": "ubuntu-latest",
          steps: [
            {
              uses: "actions/checkout@v4",
            },
            {
              uses: "pnpm/action-setup@v2",
              with: {
                version: "9.12.0",
              },
            },
            {
              uses: "actions/setup-node@v4",
              with: {
                "node-version": "20",
                "cache": "pnpm",
              },
            },
            {
              run: "pnpm install",
            },
            {
              run: "pnpm run build",
            },
            {
              name: "Deploy to production",
              run: "pnpm run deploy",
              env: {
                DEPLOY_TOKEN: "${{ secrets.DEPLOY_TOKEN }}",
              },
            },
          ],
        },
      },
    },
  },

  /**
   * Build scripts
   */
  buildScripts: {
    android: "eas build --platform android --non-interactive",
    ios: "eas build --platform ios --non-interactive",
    windows: "npm run electron:build -- --win",
    linux: "npm run electron:build -- --linux",
    macos: "npm run electron:build -- --mac",
    web: "pnpm run build",
    all: "pnpm run build && npm run electron:build",
  },

  /**
   * Test scripts
   */
  testScripts: {
    unit: "vitest run",
    integration: "vitest run --include='**/*.integration.test.ts'",
    e2e: "playwright test",
    all: "vitest run && playwright test",
  },

  /**
   * Deployment scripts
   */
  deploymentScripts: {
    androidPlayStore: "fastlane android deploy",
    iosAppStore: "fastlane ios deploy",
    windowsWebsite: "scripts/deploy-windows.sh",
    linuxWebsite: "scripts/deploy-linux.sh",
    webProduction: "vercel deploy --prod",
  },

  /**
   * Version management
   */
  versionManagement: {
    strategy: "semantic",
    autoIncrement: true,
    tagFormat: "v{version}",
    changelogFile: "CHANGELOG.md",
    releaseNotesFile: "RELEASE_NOTES.md",
  },

  /**
   * Artifact management
   */
  artifactManagement: {
    retention: 30, // days
    deleteOldArtifacts: true,
    uploadToS3: true,
    s3Bucket: "metodo-builds",
    s3Region: "us-east-1",
  },

  /**
   * Notification configuration
   */
  notifications: {
    slack: {
      enabled: true,
      webhook: process.env.SLACK_WEBHOOK,
      channel: "#deployments",
      mentionOnFailure: "@devops",
    },
    email: {
      enabled: true,
      recipients: ["team@metodo.app"],
      notifyOnFailure: true,
      notifyOnSuccess: false,
    },
    github: {
      enabled: true,
      createIssueOnFailure: true,
      assignTo: "sanskaryadav",
    },
  },

  /**
   * Performance monitoring
   */
  performanceMonitoring: {
    enabled: true,
    trackBuildTime: true,
    trackTestTime: true,
    trackDeploymentTime: true,
    alertOnSlowBuilds: true,
    slowBuildThreshold: 600000, // 10 minutes
  },

  /**
   * Security configuration
   */
  security: {
    enableSecretScanning: true,
    enableDependencyChecking: true,
    enableCodeScanning: true,
    enableSAST: true,
    enableDAST: true,
  },

  /**
   * Rollback configuration
   */
  rollback: {
    enabled: true,
    autoRollbackOnFailure: true,
    rollbackStrategy: "previous-stable",
    notifyOnRollback: true,
  },

  /**
   * Environment configuration
   */
  environments: {
    development: {
      branch: "develop",
      autoDeployOnPush: false,
      requireApproval: false,
    },
    staging: {
      branch: "staging",
      autoDeployOnPush: true,
      requireApproval: false,
    },
    production: {
      branch: "main",
      autoDeployOnPush: false,
      requireApproval: true,
      approvers: ["sanskaryadav"],
    },
  },

  /**
   * Scheduled jobs
   */
  scheduledJobs: {
    dailyBuild: {
      schedule: "0 2 * * *", // 2 AM UTC
      branches: ["main"],
      action: "build",
    },
    weeklySecurityScan: {
      schedule: "0 0 * * 0", // Sunday midnight UTC
      branches: ["main"],
      action: "security-scan",
    },
    monthlyDependencyUpdate: {
      schedule: "0 0 1 * *", // First day of month
      branches: ["main"],
      action: "update-dependencies",
    },
  },
};

/**
 * Export configuration
 */
export default cicdPipelineConfig;
