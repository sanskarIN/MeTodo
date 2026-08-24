/**
 * =============================================================================
 * (c) Copyright Sanskar Yadav. All rights reserved.
 * Made by Sanskar Yadav.
 * =============================================================================
 *
 * FILE: build-config/android-build.config.ts
 * PURPOSE: Android build configuration for Google Play Store deployment
 *
 * DESCRIPTION:
 * This file contains comprehensive Android build configuration including:
 * - Build variants (debug, release, staging)
 * - Signing configuration
 * - Optimization settings
 * - Permissions configuration
 * - Firebase configuration
 * - Google Play Store settings
 * - Version management
 * - ProGuard/R8 configuration
 * - Keystore management
 *
 * FEATURES:
 * - Multiple build variants
 * - Automatic versioning
 * - Secure signing
 * - ProGuard obfuscation
 * - Firebase integration
 * - Crash reporting
 * - Analytics tracking
 * - Performance monitoring
 *
 * DEPENDENCIES:
 * - Expo
 * - EAS Build
 * - Firebase
 * - Google Play Services
 *
 * =============================================================================
 */

import { ExpoConfig } from "expo/config";

/**
 * Android build configuration
 */
export const androidBuildConfig = {
  /**
   * Build variants
   */
  variants: {
    debug: {
      name: "debug",
      displayName: "MeTodo Debug",
      buildType: "debug",
      debuggable: true,
      minifyEnabled: false,
      shrinkResources: false,
      versionNameSuffix: "-debug",
      applicationIdSuffix: ".debug",
    },
    staging: {
      name: "staging",
      displayName: "MeTodo Staging",
      buildType: "release",
      debuggable: false,
      minifyEnabled: true,
      shrinkResources: true,
      versionNameSuffix: "-staging",
      applicationIdSuffix: ".staging",
      proguardFiles: ["proguard-rules.pro", "proguard-android.txt"],
    },
    release: {
      name: "release",
      displayName: "MeTodo",
      buildType: "release",
      debuggable: false,
      minifyEnabled: true,
      shrinkResources: true,
      versionNameSuffix: "",
      applicationIdSuffix: "",
      proguardFiles: ["proguard-rules.pro", "proguard-android-optimize.txt"],
    },
  },

  /**
   * Signing configuration
   */
  signing: {
    release: {
      keystore: {
        path: process.env.ANDROID_KEYSTORE_PATH || "./android/app/release.keystore",
        password: process.env.ANDROID_KEYSTORE_PASSWORD,
        alias: process.env.ANDROID_KEY_ALIAS,
        aliasPassword: process.env.ANDROID_KEY_PASSWORD,
      },
      v1SigningEnabled: true,
      v2SigningEnabled: true,
    },
    staging: {
      keystore: {
        path: process.env.ANDROID_KEYSTORE_PATH || "./android/app/staging.keystore",
        password: process.env.ANDROID_KEYSTORE_PASSWORD,
        alias: process.env.ANDROID_KEY_ALIAS,
        aliasPassword: process.env.ANDROID_KEY_PASSWORD,
      },
      v1SigningEnabled: true,
      v2SigningEnabled: true,
    },
  },

  /**
   * Optimization settings
   */
  optimization: {
    minSdkVersion: 24,
    targetSdkVersion: 34,
    compileSdkVersion: 34,
    ndkVersion: "25.2.9519653",
    buildToolsVersion: "34.0.0",
    enableProguard: true,
    enableR8: true,
    enableDesugar: true,
    enableMultidex: true,
    enableShrinking: true,
    enableOptimization: true,
  },

  /**
   * Permissions configuration
   */
  permissions: [
    "android.permission.INTERNET",
    "android.permission.ACCESS_NETWORK_STATE",
    "android.permission.ACCESS_COARSE_LOCATION",
    "android.permission.ACCESS_FINE_LOCATION",
    "android.permission.CAMERA",
    "android.permission.RECORD_AUDIO",
    "android.permission.READ_EXTERNAL_STORAGE",
    "android.permission.WRITE_EXTERNAL_STORAGE",
    "android.permission.READ_CALENDAR",
    "android.permission.WRITE_CALENDAR",
    "android.permission.READ_CONTACTS",
    "android.permission.WRITE_CONTACTS",
    "android.permission.GET_ACCOUNTS",
    "android.permission.USE_FINGERPRINT",
    "android.permission.USE_BIOMETRIC",
    "android.permission.POST_NOTIFICATIONS",
    "android.permission.VIBRATE",
    "android.permission.WAKE_LOCK",
  ],

  /**
   * Google Play Store configuration
   */
  googlePlayStore: {
    packageName: "space.manus.metodo",
    applicationId: "space.manus.metodo",
    versionCode: 1,
    versionName: "1.0.0",
    releaseTrack: "internal",
    inAppUpdatePriority: 3,
    dynamicDelivery: true,
    onDemandModules: ["feature_collaboration", "feature_analytics"],
  },

  /**
   * Firebase configuration
   */
  firebase: {
    enabled: true,
    analyticsEnabled: true,
    crashlyticsEnabled: true,
    performanceMonitoringEnabled: true,
    remoteConfigEnabled: true,
    messagingEnabled: true,
    authenticationEnabled: true,
    databaseEnabled: true,
    storageEnabled: true,
    functionsEnabled: true,
  },

  /**
   * Dependencies configuration
   */
  dependencies: {
    compileSdkVersion: 34,
    minSdkVersion: 24,
    targetSdkVersion: 34,
    androidxCoreVersion: "1.10.1",
    androidxAppcompatVersion: "1.6.1",
    androidxConstraintlayoutVersion: "2.1.4",
    firebaseBoMVersion: "32.3.1",
    googlePlayServicesVersion: "20.51.0",
    exoplayerVersion: "2.19.1",
    okhttp3Version: "4.11.0",
    retrofitVersion: "2.10.0",
    glideVersion: "4.16.0",
    butterKnifeVersion: "10.2.3",
    daggerVersion: "2.48.1",
    roomVersion: "2.5.2",
    workVersion: "2.8.1",
  },

  /**
   * Build features
   */
  buildFeatures: {
    viewBinding: true,
    dataBinding: true,
    aidl: false,
    renderScript: false,
    resValues: true,
    shaders: true,
  },

  /**
   * Lint options
   */
  lintOptions: {
    checkReleaseBuilds: true,
    abortOnError: false,
    warningsAsErrors: false,
    disable: [
      "MissingTranslation",
      "ExtraTranslation",
      "MissingDimensionResource",
      "TypographyEllipsis",
    ],
  },

  /**
   * ProGuard configuration
   */
  proguardRules: {
    keepClasses: [
      "space.manus.metodo.**",
      "com.facebook.**",
      "com.google.**",
      "androidx.**",
      "com.squareup.okhttp3.**",
      "retrofit2.**",
      "com.google.firebase.**",
    ],
    keepMethods: [
      "-keep public class * extends android.app.Activity",
      "-keep public class * extends android.app.Service",
      "-keep public class * extends android.content.BroadcastReceiver",
      "-keep public class * extends android.content.ContentProvider",
      "-keep public class * extends android.view.View",
    ],
    optimizations: [
      "-optimizationpasses 5",
      "-dontusemixedcaseclassnames",
      "-verbose",
      "-optimizations !code/simplification/arithmetic,!field/*,!class/merging/*",
    ],
  },

  /**
   * Keystore configuration
   */
  keystore: {
    storeFile: "release.keystore",
    storePassword: process.env.ANDROID_KEYSTORE_PASSWORD,
    keyAlias: process.env.ANDROID_KEY_ALIAS,
    keyPassword: process.env.ANDROID_KEY_PASSWORD,
    validity: 10950, // 30 years
    keySize: 2048,
    algorithm: "RSA",
  },

  /**
   * Version configuration
   */
  version: {
    major: 1,
    minor: 0,
    patch: 0,
    build: process.env.BUILD_NUMBER || "1",
    versionCode: () => {
      const now = new Date();
      return (
        now.getFullYear() * 10000 +
        (now.getMonth() + 1) * 100 +
        now.getDate()
      );
    },
  },

  /**
   * App signing configuration
   */
  appSigning: {
    enableV1Signing: true,
    enableV2Signing: true,
    enableSourceStamp: false,
  },

  /**
   * Network security configuration
   */
  networkSecurity: {
    cleartextTrafficPermitted: false,
    domains: [
      {
        domain: "metodo.app",
        includeSubdomains: true,
        certificatePins: [],
      },
    ],
  },

  /**
   * Backup configuration
   */
  backup: {
    enabled: true,
    backupAgent: "com.google.android.backup.BackupAgentHelper",
    backupService: "com.google.android.gms.backup.BackupTransportService",
  },

  /**
   * Adaptive icon configuration
   */
  adaptiveIcon: {
    backgroundColor: "#E6F4FE",
    foregroundImage: "assets/images/android-icon-foreground.png",
    backgroundImage: "assets/images/android-icon-background.png",
    monochromeImage: "assets/images/android-icon-monochrome.png",
  },

  /**
   * Notification configuration
   */
  notifications: {
    icon: "assets/images/notification-icon.png",
    color: "#0a7ea4",
    defaultChannel: {
      id: "default",
      name: "Default Notifications",
      importance: 4,
      enableVibration: true,
      enableLights: true,
      lightColor: "#0a7ea4",
      sound: "default",
    },
    channels: [
      {
        id: "tasks",
        name: "Task Notifications",
        importance: 4,
        enableVibration: true,
        sound: "default",
      },
      {
        id: "collaboration",
        name: "Collaboration Notifications",
        importance: 4,
        enableVibration: true,
        sound: "default",
      },
      {
        id: "reminders",
        name: "Task Reminders",
        importance: 4,
        enableVibration: true,
        sound: "default",
      },
    ],
  },

  /**
   * Gradle configuration
   */
  gradle: {
    repositories: [
      "google()",
      "mavenCentral()",
      "maven { url 'https://jitpack.io' }",
      "maven { url 'https://maven.google.com' }",
    ],
    plugins: [
      "com.android.application",
      "kotlin-android",
      "kotlin-kapt",
      "com.google.gms.google-services",
      "com.google.firebase.crashlytics",
      "com.google.firebase.perf",
    ],
  },

  /**
   * Build configuration
   */
  buildConfig: {
    buildConfigFields: {
      DEBUG: "boolean",
      API_BASE_URL: "String",
      API_TIMEOUT: "int",
      LOG_LEVEL: "String",
      FEATURE_FLAGS: "String",
    },
    resValues: {
      strings: {
        app_name: "MeTodo",
        app_description: "Stay productive with MeTodo",
      },
    },
  },

  /**
   * EAS Build configuration
   */
  easBuild: {
    android: {
      buildType: "release",
      gradleCommand: ":app:bundleRelease",
      withoutCredentials: false,
      autoIncrement: true,
    },
  },
};

/**
 * Export configuration
 */
export default androidBuildConfig;
