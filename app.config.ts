// Load environment variables with proper priority (system > .env)
import "./scripts/load-env.js";
import type { ExpoConfig } from "expo/config";

// Keep the current package identifier unchanged until the release owner
// approves the permanent Android/iOS application identity before signing.
const rawBundleId = "com.app.metodo";
const bundleId =
  rawBundleId
    .replace(/[-_]/g, ".") // Replace hyphens/underscores with dots
    .replace(/[^a-zA-Z0-9.]/g, "") // Remove invalid chars
    .replace(/\.+/g, ".") // Collapse consecutive dots
    .replace(/^\.+|\.+$/g, "") // Trim leading/trailing dots
    .toLowerCase()
    .split(".")
    .map((segment) => {
      // Android requires each segment to start with a letter
      // Prefix with 'x' if segment starts with a digit
      return /^[a-zA-Z]/.test(segment) ? segment : "x" + segment;
    })
    .join(".") || "com.app.metodo";
// Stable, branded Expo deep link scheme; no template-agent prefixes.
const appScheme = "metodo";

const env = {
  // App branding - update these values directly (do not use env vars)
  appName: "MeTodo",
  appSlug: "metodo",
  // S3 URL of the app logo - set this to the URL returned by generate_image when creating custom logo
  // Leave empty to use the default icon from assets/images/icon.png
  logoUrl: "/manus-storage/metodo-app-icon_642c8994.png",
  // Branding asset URLs
  logoTextUrl: "/manus-storage/metodo-logo-text_9ebebd2c.png",
  bannerUrl: "/manus-storage/metodo-banner_73c4b3eb.png",
  featureTasksUrl: "/manus-storage/metodo-feature-tasks_36440349.png",
  featureAvatarUrl: "/manus-storage/metodo-feature-avatar_e0e366ca.png",
  featureThemesUrl: "/manus-storage/metodo-feature-themes_dd971af3.png",
  featureDeveloperUrl: "/manus-storage/metodo-feature-developer_c34d5fbb.png",
  iconTaskUrl: "/manus-storage/metodo-icon-task_28eae538.png",
  iconAvatarUrl: "/manus-storage/metodo-icon-avatar_ea3735f9.png",
  iconThemesUrl: "/manus-storage/metodo-icon-themes_dc961362.png",
  appIconUrl: "/manus-storage/metodo-icon_a1a34a6e.png",
  scheme: appScheme,
  iosBundleId: bundleId,
  androidPackage: bundleId,
};

const config: ExpoConfig = {
  name: env.appName,
  slug: env.appSlug,
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: env.scheme,
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: env.iosBundleId,
    "infoPlist": {
        "ITSAppUsesNonExemptEncryption": false
      }
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/android-icon-foreground.png",
      backgroundImage: "./assets/images/android-icon-background.png",
      monochromeImage: "./assets/images/android-icon-monochrome.png",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: env.androidPackage,
    permissions: ["POST_NOTIFICATIONS", "READ_CALENDAR", "WRITE_CALENDAR"],
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: [
          {
            scheme: env.scheme,
            host: "*",
          },
        ],
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-calendar",
      {
        calendarPermission: "Allow MeTodo to add and update deadlines in your calendar.",
      },
    ],
    [
      "expo-audio",
      {
        microphonePermission: "Allow $(PRODUCT_NAME) to access your microphone.",
      },
    ],
    [
      "expo-video",
      {
        supportsBackgroundPlayback: true,
        supportsPictureInPicture: true,
      },
    ],
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
        dark: {
          backgroundColor: "#000000",
        },
      },
    ],
    [
      "expo-build-properties",
      {
        android: {
          buildArchs: ["armeabi-v7a", "arm64-v8a"],
          minSdkVersion: 24,
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
};

export default config;
