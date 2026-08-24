// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

/**
 * FILE PURPOSE: Application Configuration
 * 
 * This file contains all configuration settings for the MeTodo application.
 * Centralized configuration management for easy updates and maintenance.
 * 
 * Features:
 * - App metadata
 * - Feature flags
 * - API endpoints
 * - Storage settings
 * - Notification settings
 * - Theme settings
 */

/**
 * App metadata configuration
 */
export const APP_METADATA = {
  name: 'MeTodo',
  version: '1.0.0',
  build: '1',
  description: 'A premium task management app with avatar creator and 50+ themes',
  author: 'Sanskar Yadav',
  email: 'supportramsandesh@gmail.com',
  website: 'https://github.com/Sanskar-in/MeTodo',
  repository: 'https://github.com/Sanskar-in/MeTodo',
  license: 'MIT',
  keywords: ['task', 'management', 'productivity', 'todo', 'avatar', 'themes'],
} as const;

/**
 * Feature flags configuration
 */
export const FEATURE_FLAGS = {
  // Core features
  enableTaskManagement: true,
  enableAvatarCreator: true,
  enableThemes: true,
  enableDeveloperOptions: true,

  // Advanced features
  enableNotifications: true,
  enableAnalytics: true,
  enableCloudSync: false,
  enableUserAuth: false,
  enableCollaboration: false,

  // UI features
  enableAnimations: true,
  enableGlassmorphism: true,
  enableDarkMode: true,
  enableAccessibility: true,

  // Experimental
  enableVoiceInput: false,
  enableAIAssistant: false,
  enableOfflineMode: true,
} as const;

/**
 * API endpoints configuration
 */
export const API_CONFIG = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
  endpoints: {
    tasks: '/api/tasks',
    avatars: '/api/avatars',
    themes: '/api/themes',
    users: '/api/users',
    notifications: '/api/notifications',
    analytics: '/api/analytics',
  },
} as const;

/**
 * Storage configuration
 */
export const STORAGE_CONFIG = {
  // AsyncStorage keys
  keys: {
    tasks: '@metodo_tasks',
    avatars: '@metodo_avatars',
    settings: '@metodo_settings',
    themes: '@metodo_themes',
    user: '@metodo_user',
    cache: '@metodo_cache',
    logs: '@metodo_logs',
  },

  // Storage limits
  maxTasks: 1000,
  maxAvatars: 50,
  maxCacheSize: 50 * 1024 * 1024, // 50 MB
  maxLogSize: 10 * 1024 * 1024, // 10 MB

  // Expiration times (in milliseconds)
  cacheExpiration: 24 * 60 * 60 * 1000, // 24 hours
  sessionExpiration: 30 * 24 * 60 * 60 * 1000, // 30 days
} as const;

/**
 * Notification configuration
 */
export const NOTIFICATION_CONFIG = {
  // Default settings
  enabled: true,
  sound: true,
  vibration: true,
  badge: true,

  // Quiet hours (24-hour format)
  quietHoursStart: 22,
  quietHoursEnd: 8,

  // Reminder times (minutes before due date)
  reminderTimes: [15, 60, 1440], // 15 min, 1 hour, 1 day

  // Notification types
  types: {
    taskReminder: 'task_reminder',
    taskDue: 'task_due',
    taskOverdue: 'task_overdue',
    dailySummary: 'daily_summary',
    achievement: 'achievement',
  },

  // Daily summary time
  dailySummaryTime: '09:00',
} as const;

/**
 * Theme configuration
 */
export const THEME_CONFIG = {
  // Default theme
  defaultTheme: 'Default',

  // Color modes
  colorModes: ['light', 'dark', 'auto'] as const,
  defaultColorMode: 'auto' as const,

  // Theme transition duration (ms)
  transitionDuration: 300,

  // Accent colors
  accentColors: [
    '#0a7ea4', // Teal
    '#0066cc', // Blue
    '#ff6b6b', // Red
    '#ffa500', // Orange
    '#22c55e', // Green
    '#a855f7', // Purple
    '#ec4899', // Pink
    '#06b6d4', // Cyan
  ],
} as const;

/**
 * Task configuration
 */
export const TASK_CONFIG = {
  // Task priorities
  priorities: ['low', 'medium', 'high', 'urgent'] as const,
  defaultPriority: 'medium' as const,

  // Task statuses
  statuses: ['pending', 'in-progress', 'completed', 'cancelled'] as const,
  defaultStatus: 'pending' as const,

  // Task categories
  defaultCategories: [
    'Work',
    'Personal',
    'Shopping',
    'Health',
    'Finance',
    'Learning',
    'Entertainment',
    'Other',
  ],

  // Recurring patterns
  recurringPatterns: ['daily', 'weekly', 'monthly', 'yearly'] as const,

  // Max subtasks per task
  maxSubtasks: 50,

  // Max tags per task
  maxTags: 10,

  // Max notes length (characters)
  maxNotesLength: 5000,
} as const;

/**
 * Avatar configuration
 */
export const AVATAR_CONFIG = {
  // Avatar customization options
  hairStyles: 8,
  eyeShapes: 4,
  accessories: 6,
  skinTones: 5,

  // Avatar size
  size: 200,

  // Avatar colors
  colors: {
    hair: ['#8B4513', '#FFD700', '#FF6347', '#4169E1', '#FF1493', '#00CED1'],
    eyes: ['#000000', '#8B4513', '#4169E1', '#228B22'],
    skin: ['#FDBCB4', '#F4A460', '#D2B48C', '#CD853F', '#8B4513'],
  },
} as const;

/**
 * Analytics configuration
 */
export const ANALYTICS_CONFIG = {
  // Tracking enabled
  enabled: true,

  // Events to track
  events: {
    taskCreated: 'task_created',
    taskCompleted: 'task_completed',
    taskDeleted: 'task_deleted',
    themeChanged: 'theme_changed',
    avatarCreated: 'avatar_created',
    settingsUpdated: 'settings_updated',
  },

  // Batch size for analytics
  batchSize: 10,

  // Flush interval (ms)
  flushInterval: 60000, // 1 minute
} as const;

/**
 * Developer options configuration
 */
export const DEVELOPER_CONFIG = {
  // Enable developer mode
  enabled: false,

  // Version taps required to unlock
  versionTapsRequired: 10,

  // Debug logging
  debugLogging: false,

  // Performance monitoring
  performanceMonitoring: false,

  // Network throttling
  networkThrottling: false,

  // Layout bounds
  showLayoutBounds: false,

  // Frame rate display
  showFrameRate: false,
} as const;

/**
 * Validation configuration
 */
export const VALIDATION_CONFIG = {
  // Task title
  taskTitleMinLength: 1,
  taskTitleMaxLength: 200,

  // Task description
  taskDescriptionMaxLength: 5000,

  // Email
  emailPattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  // URL
  urlPattern: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
} as const;

/**
 * Pagination configuration
 */
export const PAGINATION_CONFIG = {
  // Default page size
  defaultPageSize: 20,

  // Max page size
  maxPageSize: 100,

  // Page size options
  pageSizeOptions: [10, 20, 50, 100],
} as const;

/**
 * Timeout configuration
 */
export const TIMEOUT_CONFIG = {
  // API request timeout
  apiTimeout: 30000,

  // Debounce delay
  debounceDelay: 300,

  // Throttle delay
  throttleDelay: 500,

  // Animation duration
  animationDuration: 300,

  // Transition duration
  transitionDuration: 200,
} as const;

/**
 * Error configuration
 */
export const ERROR_CONFIG = {
  // Error messages
  messages: {
    networkError: 'Network error. Please check your connection.',
    validationError: 'Please check your input and try again.',
    serverError: 'Server error. Please try again later.',
    notFoundError: 'Resource not found.',
    unauthorizedError: 'Unauthorized. Please log in.',
    forbiddenError: 'You do not have permission to access this resource.',
  },

  // Error codes
  codes: {
    NETWORK_ERROR: 'NETWORK_ERROR',
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    SERVER_ERROR: 'SERVER_ERROR',
    NOT_FOUND: 'NOT_FOUND',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
  },
} as const;

/**
 * Get configuration value
 */
export function getConfig(path: string, defaultValue?: any): any {
  const configs = {
    app: APP_METADATA,
    features: FEATURE_FLAGS,
    api: API_CONFIG,
    storage: STORAGE_CONFIG,
    notifications: NOTIFICATION_CONFIG,
    theme: THEME_CONFIG,
    task: TASK_CONFIG,
    avatar: AVATAR_CONFIG,
    analytics: ANALYTICS_CONFIG,
    developer: DEVELOPER_CONFIG,
    validation: VALIDATION_CONFIG,
    pagination: PAGINATION_CONFIG,
    timeout: TIMEOUT_CONFIG,
    error: ERROR_CONFIG,
  };

  const keys = path.split('.');
  let value: any = configs;

  for (const key of keys) {
    value = value?.[key];
    if (value === undefined) return defaultValue;
  }

  return value;
}

/**
 * Check if feature is enabled
 */
export function isFeatureEnabled(feature: keyof typeof FEATURE_FLAGS): boolean {
  return FEATURE_FLAGS[feature];
}

export default {
  APP_METADATA,
  FEATURE_FLAGS,
  API_CONFIG,
  STORAGE_CONFIG,
  NOTIFICATION_CONFIG,
  THEME_CONFIG,
  TASK_CONFIG,
  AVATAR_CONFIG,
  ANALYTICS_CONFIG,
  DEVELOPER_CONFIG,
  VALIDATION_CONFIG,
  PAGINATION_CONFIG,
  TIMEOUT_CONFIG,
  ERROR_CONFIG,
  getConfig,
  isFeatureEnabled,
};
