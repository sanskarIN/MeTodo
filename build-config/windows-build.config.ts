/**
 * =============================================================================
 * (c) Copyright Sanskar Yadav. All rights reserved.
 * Made by Sanskar Yadav.
 * =============================================================================
 *
 * FILE: build-config/windows-build.config.ts
 * PURPOSE: Windows build configuration for .exe distribution
 *
 * DESCRIPTION:
 * This file contains comprehensive Windows build configuration including:
 * - Electron configuration
 * - Code signing
 * - Installer configuration
 * - Auto-update settings
 * - Windows-specific optimizations
 * - Registry configuration
 * - File associations
 * - Certificate management
 *
 * FEATURES:
 * - Electron-based desktop app
 * - NSIS installer
 * - Code signing with certificates
 * - Auto-update capability
 * - Windows Defender integration
 * - Start menu integration
 * - File type associations
 * - Uninstaller support
 *
 * DEPENDENCIES:
 * - Electron
 * - Electron Builder
 * - NSIS
 * - OpenSSL
 * - Windows SDK
 *
 * =============================================================================
 */

/**
 * Windows build configuration
 */
export const windowsBuildConfig = {
  /**
   * Electron configuration
   */
  electron: {
    main: "dist/electron/main.js",
    preload: "dist/electron/preload.js",
    nodeIntegration: false,
    enableRemoteModule: false,
    contextIsolation: true,
    sandbox: true,
    webSecurity: true,
    allowRunningInsecureContent: false,
  },

  /**
   * Build configuration
   */
  build: {
    appId: "space.manus.metodo",
    productName: "MeTodo",
    directories: {
      output: "dist/windows",
      buildResources: "build/windows",
      scripts: "scripts/windows",
    },
    files: [
      "dist/electron/**/*",
      "dist/app/**/*",
      "node_modules/**/*",
      "package.json",
      "assets/**/*",
    ],
    extraMetadata: {
      name: "metodo",
    },
  },

  /**
   * Windows-specific configuration
   */
  win: {
    target: [
      {
        target: "nsis",
        arch: ["x64", "ia32"],
      },
      {
        target: "portable",
        arch: ["x64"],
      },
      {
        target: "msi",
        arch: ["x64"],
      },
      {
        target: "appx",
        arch: ["x64"],
      },
    ],
    certificateFile: process.env.WIN_CERTIFICATE_FILE,
    certificatePassword: process.env.WIN_CERTIFICATE_PASSWORD,
    signingHashAlgorithms: ["sha256"],
    sign: "./scripts/windows/sign.js",
    signtool: "C:\\Program Files (x86)\\Windows Kits\\10\\bin\\10.0.22621.0\\x64\\signtool.exe",
  },

  /**
   * NSIS installer configuration
   */
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: "MeTodo",
    installerIcon: "build/windows/icon.ico",
    uninstallerIcon: "build/windows/icon.ico",
    installerHeaderIcon: "build/windows/icon.ico",
    installerSidebar: "build/windows/sidebar.bmp",
    installerSidebarImage: "build/windows/sidebar.bmp",
    artifactName: "${productName}-${version}-${arch}-installer.${ext}",
    include: "scripts/windows/installer.nsi",
    script: "scripts/windows/installer.nsi",
    license: "LICENSE.txt",
    languages: ["English", "French", "Spanish", "German", "Italian", "Portuguese"],
  },

  /**
   * Portable executable configuration
   */
  portable: {
    artifactName: "${productName}-${version}-${arch}-portable.${ext}",
  },

  /**
   * MSI installer configuration
   */
  msi: {
    artifactName: "${productName}-${version}-${arch}-installer.${ext}",
    oneClick: false,
    allowToChangeInstallationDirectory: true,
  },

  /**
   * AppX (Microsoft Store) configuration
   */
  appx: {
    artifactName: "${productName}-${version}-${arch}.${ext}",
    displayName: "MeTodo",
    identityName: "MeTodo",
    publisherDisplayName: "Sanskar Yadav",
    backgroundColor: "#E6F4FE",
  },

  /**
   * Code signing configuration
   */
  signing: {
    certificatePath: process.env.WIN_CERTIFICATE_FILE,
    certificatePassword: process.env.WIN_CERTIFICATE_PASSWORD,
    signingHashAlgorithms: ["sha256"],
    timestampServer: "http://timestamp.comodoca.com",
    description: "MeTodo - Stay productive",
    url: "https://metodo.app",
  },

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
   * Squirrel configuration (for auto-updates)
   */
  squirrel: {
    enabled: true,
    iconUrl: "https://metodo.app/icon.ico",
    setupIcon: "build/windows/icon.ico",
    remoteReleases: "https://github.com/sanskaryadav/metodo/releases",
  },

  /**
   * Registry configuration
   */
  registry: {
    hive: "HKEY_LOCAL_MACHINE",
    path: "Software\\Sanskar Yadav\\MeTodo",
    values: {
      InstallPath: "{InstallPath}",
      UninstallString: "{UninstallString}",
      DisplayName: "MeTodo",
      DisplayVersion: "{Version}",
      Publisher: "Sanskar Yadav",
      URLInfoAbout: "https://metodo.app",
      HelpLink: "https://metodo.app/support",
      Contact: "support@metodo.app",
    },
  },

  /**
   * File associations
   */
  fileAssociations: [
    {
      ext: "mtodo",
      name: "MeTodo Task File",
      role: "Editor",
      icon: "build/windows/file-icon.ico",
    },
    {
      ext: "mtasks",
      name: "MeTodo Tasks Export",
      role: "Editor",
      icon: "build/windows/file-icon.ico",
    },
  ],

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
   * Shortcuts configuration
   */
  shortcuts: {
    desktop: true,
    startMenu: true,
    quickLaunch: true,
    sendTo: false,
  },

  /**
   * Installer strings
   */
  installerStrings: {
    title: "MeTodo Setup",
    subtitle: "Stay productive with MeTodo",
    welcomeMessage: "Welcome to MeTodo Setup",
    finishMessage: "MeTodo has been installed successfully",
    finishMessageReboot: "MeTodo has been installed. Please restart your computer to complete the installation.",
  },

  /**
   * Uninstaller configuration
   */
  uninstaller: {
    displayIcon: "build/windows/icon.ico",
    displayName: "MeTodo",
    displayVersion: "{Version}",
    publisher: "Sanskar Yadav",
    urlInfoAbout: "https://metodo.app",
    helpLink: "https://metodo.app/support",
    contact: "support@metodo.app",
  },

  /**
   * Windows Defender configuration
   */
  windowsDefender: {
    enabled: true,
    exclusions: [
      "{InstallPath}\\MeTodo.exe",
      "{InstallPath}\\resources",
    ],
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
   * Build environment
   */
  environment: {
    WIN_CERTIFICATE_FILE: process.env.WIN_CERTIFICATE_FILE,
    WIN_CERTIFICATE_PASSWORD: process.env.WIN_CERTIFICATE_PASSWORD,
    SIGNTOOL_PATH: "C:\\Program Files (x86)\\Windows Kits\\10\\bin\\10.0.22621.0\\x64\\signtool.exe",
    TIMESTAMP_SERVER: "http://timestamp.comodoca.com",
  },

  /**
   * Distribution configuration
   */
  distribution: {
    website: "https://metodo.app",
    downloadUrl: "https://metodo.app/download/windows",
    releaseNotesUrl: "https://metodo.app/release-notes",
    supportUrl: "https://metodo.app/support",
    issuesUrl: "https://github.com/sanskaryadav/metodo/issues",
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
   * Electron main process configuration
   */
  mainProcess: {
    enableDevTools: false,
    enableRemoteDebugging: false,
    enableV8CodeCache: true,
    enableSnapshotBlob: true,
    preloadScript: "dist/electron/preload.js",
  },

  /**
   * Renderer process configuration
   */
  rendererProcess: {
    enableNodeIntegration: false,
    enableContextIsolation: true,
    enableSandbox: true,
    preload: "dist/electron/preload.js",
  },

  /**
   * IPC configuration
   */
  ipc: {
    enableValidation: true,
    enableEncryption: true,
    timeout: 30000,
    maxMessageSize: 10485760, // 10MB
  },

  /**
   * Update configuration
   */
  updates: {
    checkInterval: 3600000, // 1 hour
    autoDownload: true,
    autoInstall: false,
    allowDowngrade: false,
    allowPrerelease: false,
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
};

/**
 * Export configuration
 */
export default windowsBuildConfig;
