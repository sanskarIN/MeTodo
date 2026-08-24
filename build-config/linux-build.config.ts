/**
 * =============================================================================
 * (c) Copyright Sanskar Yadav. All rights reserved.
 * Made by Sanskar Yadav.
 * =============================================================================
 *
 * FILE: build-config/linux-build.config.ts
 * PURPOSE: Linux build configuration for .dmg and AppImage distribution
 *
 * DESCRIPTION:
 * This file contains comprehensive Linux build configuration including:
 * - AppImage configuration
 * - Snap package configuration
 * - Flatpak configuration
 * - DEB package configuration
 * - RPM package configuration
 * - Desktop entry configuration
 * - Icon configuration
 * - Dependency management
 *
 * FEATURES:
 * - Multiple distribution formats
 * - Auto-update support
 * - Desktop integration
 * - System tray support
 * - File manager integration
 * - Package manager support
 * - Dependency resolution
 * - Security hardening
 *
 * DEPENDENCIES:
 * - Electron
 * - Electron Builder
 * - AppImage tools
 * - Snap tools
 * - Flatpak tools
 * - dpkg
 * - rpm
 *
 * =============================================================================
 */

/**
 * Linux build configuration
 */
export const linuxBuildConfig = {
  /**
   * Build configuration
   */
  build: {
    appId: "space.manus.metodo",
    productName: "MeTodo",
    directories: {
      output: "dist/linux",
      buildResources: "build/linux",
      scripts: "scripts/linux",
    },
    files: [
      "dist/electron/**/*",
      "dist/app/**/*",
      "node_modules/**/*",
      "package.json",
      "assets/**/*",
    ],
  },

  /**
   * Linux-specific configuration
   */
  linux: {
    target: [
      "AppImage",
      "snap",
      "flatpak",
      "deb",
      "rpm",
      "tar.gz",
    ],
    icon: "build/linux/icon.png",
    category: "Productivity",
    maintainer: "Sanskar Yadav <support@metodo.app>",
    description: "Stay productive with MeTodo",
  },

  /**
   * AppImage configuration
   */
  appImage: {
    artifactName: "${productName}-${version}-${arch}.${ext}",
    updateInfo: {
      provider: "github",
      owner: "sanskaryadav",
      repo: "metodo",
    },
  },

  /**
   * Snap configuration
   */
  snap: {
    artifactName: "${productName}-${version}-${arch}.${ext}",
    summary: "Stay productive with MeTodo",
    description: "MeTodo is a powerful task management application designed to help you stay productive and organized.",
    grade: "stable",
    confinement: "strict",
    plugs: [
      "home",
      "x11",
      "unity7",
      "browser-support",
      "network",
      "network-bind",
      "audio-playback",
      "audio-record",
      "camera",
      "removable-media",
    ],
    slots: [
      "dbus-metodo",
    ],
    daemon: false,
    autoStart: false,
    environment: {
      SNAP_DESKTOP_RUNTIME: "$SNAP",
    },
  },

  /**
   * Flatpak configuration
   */
  flatpak: {
    artifactName: "${productName}-${version}-${arch}.${ext}",
    id: "space.manus.metodo",
    branch: "stable",
    runtime: "org.freedesktop.Platform",
    runtimeVersion: "23.08",
    sdk: "org.freedesktop.Sdk",
    sdkExtensions: ["org.freedesktop.Sdk.Extension.node18"],
    permissions: [
      "--share=network",
      "--share=ipc",
      "--socket=x11",
      "--socket=wayland",
      "--device=dri",
      "--socket=pulseaudio",
      "--filesystem=home",
      "--filesystem=/tmp",
    ],
    modules: [
      {
        name: "metodo",
        buildsystem: "simple",
        buildCommands: [
          "install -D metodo /app/bin/metodo",
        ],
        sources: [
          {
            type: "file",
            path: "dist/linux/metodo",
            dest: "",
          },
        ],
      },
    ],
  },

  /**
   * DEB package configuration
   */
  deb: {
    artifactName: "${productName}-${version}-${arch}.${ext}",
    depends: [
      "libgtk-3-0",
      "libnotify4",
      "libnss3",
      "libxss1",
      "libxtst6",
      "xdg-utils",
      "libappindicator1",
      "libsecret-1-0",
      "fonts-liberation",
    ],
    maintainer: "Sanskar Yadav <support@metodo.app>",
    homepage: "https://metodo.app",
    category: "Productivity",
    afterInstall: "scripts/linux/deb-after-install.sh",
    afterRemove: "scripts/linux/deb-after-remove.sh",
  },

  /**
   * RPM package configuration
   */
  rpm: {
    artifactName: "${productName}-${version}-${arch}.${ext}",
    depends: [
      "gtk3",
      "libnotify",
      "nss",
      "libxss",
      "libxtst",
      "xdg-utils",
      "libappindicator",
      "libsecret",
      "liberation-fonts",
    ],
    maintainer: "Sanskar Yadav <support@metodo.app>",
    homepage: "https://metodo.app",
    category: "Productivity",
    afterInstall: "scripts/linux/rpm-after-install.sh",
    afterRemove: "scripts/linux/rpm-after-remove.sh",
  },

  /**
   * Desktop entry configuration
   */
  desktopEntry: {
    name: "MeTodo",
    comment: "Stay productive with MeTodo",
    exec: "metodo %U",
    icon: "metodo",
    type: "Application",
    categories: "Productivity;",
    keywords: "task;todo;productivity;",
    mimeType: "application/x-metodo;application/x-metasks;",
    terminal: false,
    startupNotify: true,
    "x-ubuntu-gettext-domain": "metodo",
  },

  /**
   * MIME types configuration
   */
  mimeTypes: [
    {
      type: "application/x-metodo",
      ext: "mtodo",
      icon: "metodo-file",
      description: "MeTodo Task File",
    },
    {
      type: "application/x-metasks",
      ext: "mtasks",
      icon: "metodo-file",
      description: "MeTodo Tasks Export",
    },
  ],

  /**
   * Icon configuration
   */
  icons: {
    "16x16": "build/linux/icons/16x16/metodo.png",
    "32x32": "build/linux/icons/32x32/metodo.png",
    "48x48": "build/linux/icons/48x48/metodo.png",
    "64x64": "build/linux/icons/64x64/metodo.png",
    "128x128": "build/linux/icons/128x128/metodo.png",
    "256x256": "build/linux/icons/256x256/metodo.png",
    "512x512": "build/linux/icons/512x512/metodo.png",
  },

  /**
   * System integration
   */
  systemIntegration: {
    enableSystemTray: true,
    enableDesktopIntegration: true,
    enableFileManager: true,
    enableContextMenu: true,
    enableProtocolHandler: true,
  },

  /**
   * Protocol handlers
   */
  protocols: [
    {
      name: "MeTodo",
      schemes: ["metodo"],
      role: "Editor",
    },
  ],

  /**
   * File associations
   */
  fileAssociations: [
    {
      ext: "mtodo",
      name: "MeTodo Task File",
      role: "Editor",
      icon: "metodo-file",
    },
    {
      ext: "mtasks",
      name: "MeTodo Tasks Export",
      role: "Editor",
      icon: "metodo-file",
    },
  ],

  /**
   * Auto-update configuration
   */
  autoUpdate: {
    enabled: true,
    provider: "github",
    owner: "sanskaryadav",
    repo: "metodo",
    releaseType: "release",
    checkForUpdatesInterval: 3600000, // 1 hour
    allowDowngrade: false,
    allowPrerelease: false,
  },

  /**
   * Security configuration
   */
  security: {
    enableSandbox: true,
    enableContextIsolation: true,
    enableNodeIntegration: false,
    enableRemoteModule: false,
    preloadScript: "dist/electron/preload.js",
    contentSecurityPolicy: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';",
  },

  /**
   * Performance configuration
   */
  performance: {
    enableV8CodeCache: true,
    enableCodeCache: true,
    enableSnapshotBlob: true,
  },

  /**
   * Distribution configuration
   */
  distribution: {
    website: "https://metodo.app",
    downloadUrl: "https://metodo.app/download/linux",
    releaseNotesUrl: "https://metodo.app/release-notes",
    supportUrl: "https://metodo.app/support",
    issuesUrl: "https://github.com/sanskaryadav/metodo/issues",
  },

  /**
   * Package manager configuration
   */
  packageManager: {
    apt: {
      enabled: true,
      repository: "ppa:sanskaryadav/metodo",
      gpgKey: "https://metodo.app/apt-key.gpg",
    },
    snap: {
      enabled: true,
      channel: "stable",
    },
    flatpak: {
      enabled: true,
      repository: "https://flathub.org/repo/flathub.flatpakrepo",
    },
    aur: {
      enabled: true,
      maintainer: "sanskaryadav",
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
   * Build environment
   */
  environment: {
    ELECTRON_BUILDER_ALLOW_UNRESOLVED_DEPENDENCIES: "true",
  },

  /**
   * Crash reporting configuration
   */
  crashReporting: {
    enabled: true,
    endpoint: "https://metodo.app/api/crashes",
    includeSystemInfo: true,
    includeStackTrace: true,
  },

  /**
   * Analytics configuration
   */
  analytics: {
    enabled: true,
    endpoint: "https://metodo.app/api/analytics",
    trackingId: process.env.ANALYTICS_ID,
  },

  /**
   * Dependencies configuration
   */
  dependencies: {
    runtime: [
      "libgtk-3-0",
      "libnotify4",
      "libnss3",
      "libxss1",
      "libxtst6",
      "xdg-utils",
      "libappindicator1",
      "libsecret-1-0",
      "fonts-liberation",
    ],
    build: [
      "build-essential",
      "libgtk-3-dev",
      "libnotify-dev",
      "libnss3-dev",
      "libxss-dev",
      "libxtst-dev",
      "xdg-utils",
      "libappindicator1",
      "libsecret-1-dev",
      "fonts-liberation",
    ],
  },
};

/**
 * Export configuration
 */
export default linuxBuildConfig;
