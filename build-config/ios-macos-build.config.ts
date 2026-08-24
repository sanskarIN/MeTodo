/**
 * =============================================================================
 * (c) Copyright Sanskar Yadav. All rights reserved.
 * Made by Sanskar Yadav.
 * =============================================================================
 *
 * FILE: build-config/ios-macos-build.config.ts
 * PURPOSE: iOS and macOS build configuration for future implementation
 *
 * DESCRIPTION:
 * This file contains comprehensive iOS and macOS build configuration including:
 * - iOS app store configuration
 * - TestFlight configuration
 * - macOS app store configuration
 * - Code signing configuration
 * - Provisioning profile management
 * - Certificate management
 * - Build settings
 * - Deployment configuration
 *
 * FEATURES:
 * - App Store distribution
 * - TestFlight beta testing
 * - Ad-hoc distribution
 * - Enterprise distribution
 * - Code signing automation
 * - Provisioning profile management
 * - Automatic certificate handling
 * - Build versioning
 *
 * DEPENDENCIES:
 * - Xcode
 * - EAS Build
 * - Apple Developer Account
 * - Fastlane
 *
 * =============================================================================
 */

/**
 * iOS build configuration
 */
export const iosBuildConfig = {
  /**
   * Build configuration
   */
  build: {
    appId: "space.manus.metodo",
    productName: "MeTodo",
    bundleId: "space.manus.metodo",
    teamId: process.env.APPLE_TEAM_ID,
  },

  /**
   * iOS-specific configuration
   */
  ios: {
    bundleId: "space.manus.metodo",
    buildNumber: process.env.BUILD_NUMBER || "1",
    deploymentTarget: "13.0",
    supportsTablet: true,
    infoPlist: {
      NSCameraUsageDescription: "MeTodo needs camera access to capture task images",
      NSMicrophoneUsageDescription: "MeTodo needs microphone access for voice tasks",
      NSPhotoLibraryUsageDescription: "MeTodo needs photo library access to add images to tasks",
      NSPhotoLibraryAddOnlyUsageDescription: "MeTodo needs permission to save images",
      NSLocationWhenInUseUsageDescription: "MeTodo needs location access for location-based tasks",
      NSLocationAlwaysAndWhenInUseUsageDescription: "MeTodo needs location access for location-based tasks",
      NSCalendarsUsageDescription: "MeTodo needs calendar access to sync with calendar",
      NSContactsUsageDescription: "MeTodo needs contacts access for team collaboration",
      NSHealthShareUsageDescription: "MeTodo needs health data access for wellness tracking",
      NSHealthUpdateUsageDescription: "MeTodo needs health data access for wellness tracking",
      NSFaceIDUsageDescription: "MeTodo uses Face ID for secure authentication",
      ITSAppUsesNonExemptEncryption: false,
      UIRequiredDeviceCapabilities: [
        "armv7",
        "arm64",
      ],
    },
  },

  /**
   * iOS signing configuration
   */
  iosSigning: {
    provisioningProfileSpecifier: process.env.IOS_PROVISIONING_PROFILE,
    codeSignIdentity: "iPhone Distribution",
    signingStyle: "automatic",
    developmentTeam: process.env.APPLE_TEAM_ID,
    certificateFile: process.env.IOS_CERTIFICATE_FILE,
    certificatePassword: process.env.IOS_CERTIFICATE_PASSWORD,
  },

  /**
   * App Store configuration
   */
  appStore: {
    bundleId: "space.manus.metodo",
    appName: "MeTodo",
    appVersion: "1.0.0",
    buildNumber: process.env.BUILD_NUMBER || "1",
    description: "Stay productive with MeTodo - a powerful task management application",
    keywords: ["task", "todo", "productivity", "management", "collaboration"],
    category: "Productivity",
    subcategory: "Task Management",
    rating: "4+",
    screenshots: {
      "5.5": [
        "screenshots/ios/5.5/1.png",
        "screenshots/ios/5.5/2.png",
        "screenshots/ios/5.5/3.png",
        "screenshots/ios/5.5/4.png",
        "screenshots/ios/5.5/5.png",
      ],
      "6.7": [
        "screenshots/ios/6.7/1.png",
        "screenshots/ios/6.7/2.png",
        "screenshots/ios/6.7/3.png",
        "screenshots/ios/6.7/4.png",
        "screenshots/ios/6.7/5.png",
      ],
    },
    previewImage: "screenshots/ios/preview.png",
    appPreviewVideo: "videos/ios/preview.mp4",
  },

  /**
   * TestFlight configuration
   */
  testFlight: {
    enabled: true,
    betaAppDescription: "Test the latest features of MeTodo before official release",
    betaAppFeedbackEmail: "beta@metodo.app",
    betaAppReviewInfo: {
      contactEmail: "support@metodo.app",
      contactFirstName: "Sanskar",
      contactLastName: "Yadav",
      contactPhone: "+1-234-567-8900",
      demoAccountName: "demo@metodo.app",
      demoAccountPassword: process.env.TESTFLIGHT_DEMO_PASSWORD,
      notes: "Test account credentials provided for review",
    },
    internalTestingGroups: [
      "Internal Team",
      "Beta Testers",
    ],
    externalTestingGroups: [
      "Public Beta",
    ],
  },

  /**
   * macOS build configuration
   */
  macos: {
    bundleId: "space.manus.metodo",
    buildNumber: process.env.BUILD_NUMBER || "1",
    deploymentTarget: "10.13",
    supportsUltraWidescreen: true,
    infoPlist: {
      NSCameraUsageDescription: "MeTodo needs camera access to capture task images",
      NSMicrophoneUsageDescription: "MeTodo needs microphone access for voice tasks",
      NSPhotoLibraryUsageDescription: "MeTodo needs photo library access to add images to tasks",
      NSLocationWhenInUseUsageDescription: "MeTodo needs location access for location-based tasks",
      NSCalendarsUsageDescription: "MeTodo needs calendar access to sync with calendar",
      NSContactsUsageDescription: "MeTodo needs contacts access for team collaboration",
      NSHealthShareUsageDescription: "MeTodo needs health data access for wellness tracking",
      NSHealthUpdateUsageDescription: "MeTodo needs health data access for wellness tracking",
    },
  },

  /**
   * macOS signing configuration
   */
  macosSigning: {
    signingIdentity: "Developer ID Application",
    teamIdentifier: process.env.APPLE_TEAM_ID,
    certificateFile: process.env.MACOS_CERTIFICATE_FILE,
    certificatePassword: process.env.MACOS_CERTIFICATE_PASSWORD,
    notarizationCredentials: {
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_ID_PASSWORD,
      teamId: process.env.APPLE_TEAM_ID,
    },
  },

  /**
   * macOS App Store configuration
   */
  macosAppStore: {
    bundleId: "space.manus.metodo",
    appName: "MeTodo",
    appVersion: "1.0.0",
    buildNumber: process.env.BUILD_NUMBER || "1",
    description: "Stay productive with MeTodo - a powerful task management application",
    keywords: ["task", "todo", "productivity", "management", "collaboration"],
    category: "Productivity",
    screenshots: {
      "13": [
        "screenshots/macos/13/1.png",
        "screenshots/macos/13/2.png",
        "screenshots/macos/13/3.png",
        "screenshots/macos/13/4.png",
        "screenshots/macos/13/5.png",
      ],
    },
    previewImage: "screenshots/macos/preview.png",
  },

  /**
   * Code signing configuration
   */
  codeSigning: {
    signingStyle: "automatic",
    provisioning: {
      development: {
        profileName: "MeTodo Development",
        bundleId: "space.manus.metodo",
      },
      distribution: {
        profileName: "MeTodo Distribution",
        bundleId: "space.manus.metodo",
      },
    },
    certificates: {
      development: {
        type: "iOS Development",
        name: "iPhone Developer",
      },
      distribution: {
        type: "iOS Distribution",
        name: "iPhone Distribution",
      },
      macosDistribution: {
        type: "Developer ID Application",
        name: "Developer ID Application",
      },
    },
  },

  /**
   * Build settings
   */
  buildSettings: {
    ios: {
      SWIFT_VERSION: "5.9",
      IPHONEOS_DEPLOYMENT_TARGET: "13.0",
      ENABLE_BITCODE: false,
      ENABLE_TESTABILITY: false,
      STRIP_INSTALLED_PRODUCT: true,
      COPY_PHASE_STRIP: true,
    },
    macos: {
      SWIFT_VERSION: "5.9",
      MACOSX_DEPLOYMENT_TARGET: "10.13",
      ENABLE_HARDENED_RUNTIME: true,
      CODE_SIGN_IDENTITY: "Developer ID Application",
    },
  },

  /**
   * Capabilities configuration
   */
  capabilities: {
    ios: [
      "push-notifications",
      "in-app-purchase",
      "apple-pay",
      "wallet",
      "siri-kit",
      "app-groups",
      "health-kit",
      "home-kit",
      "nfc",
      "car-play",
    ],
    macos: [
      "push-notifications",
      "in-app-purchase",
      "apple-pay",
      "siri-kit",
      "app-groups",
      "health-kit",
      "home-kit",
    ],
  },

  /**
   * Entitlements configuration
   */
  entitlements: {
    ios: {
      "aps-environment": "production",
      "com.apple.developer.applesignin": ["Default"],
      "com.apple.developer.in-app-payments": ["Default"],
      "com.apple.developer.healthkit": true,
      "com.apple.developer.homekit": true,
      "com.apple.developer.nfc.readersession.formats": ["NDEF", "TAG"],
    },
    macos: {
      "aps-environment": "production",
      "com.apple.developer.applesignin": ["Default"],
      "com.apple.developer.in-app-payments": ["Default"],
      "com.apple.developer.healthkit": true,
      "com.apple.developer.homekit": true,
      "com.apple.security.app-sandbox": true,
      "com.apple.security.network.client": true,
      "com.apple.security.network.server": true,
      "com.apple.security.files.user-selected.read-write": true,
    },
  },

  /**
   * Version configuration
   */
  version: {
    major: 1,
    minor: 0,
    patch: 0,
    build: process.env.BUILD_NUMBER || "1",
  },

  /**
   * EAS Build configuration
   */
  easBuild: {
    ios: {
      buildType: "release",
      distribution: "app-store",
      autoIncrement: true,
    },
    macos: {
      buildType: "release",
      distribution: "app-store",
      autoIncrement: true,
    },
  },

  /**
   * Fastlane configuration
   */
  fastlane: {
    appIdentifier: "space.manus.metodo",
    teamId: process.env.APPLE_TEAM_ID,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASSWORD,
    appStoreConnectApiKey: process.env.APP_STORE_CONNECT_API_KEY,
    matchGitUrl: process.env.MATCH_GIT_URL,
    matchGitBranch: "main",
    matchType: "appstore",
  },

  /**
   * Notarization configuration (macOS)
   */
  notarization: {
    enabled: true,
    appleId: process.env.APPLE_ID,
    appleIdPassword: process.env.APPLE_ID_PASSWORD,
    teamId: process.env.APPLE_TEAM_ID,
    stapleAfterNotarization: true,
    waitForNotarization: true,
  },

  /**
   * Distribution configuration
   */
  distribution: {
    website: "https://metodo.app",
    downloadUrl: "https://metodo.app/download",
    releaseNotesUrl: "https://metodo.app/release-notes",
    supportUrl: "https://metodo.app/support",
    issuesUrl: "https://github.com/sanskaryadav/metodo/issues",
  },
};

/**
 * Export configuration
 */
export default iosBuildConfig;
