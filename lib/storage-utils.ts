// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

/**
 * FILE PURPOSE: Storage Utilities
 * 
 * Comprehensive storage management utilities for MeTodo including
 * AsyncStorage operations, caching, and data persistence.
 * 
 * Features:
 * - AsyncStorage wrapper
 * - Cache management
 * - Data serialization
 * - Storage cleanup
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_CONFIG } from '@/config/app-config';

/**
 * Storage utility class
 */
export class StorageUtil {
  /**
   * Set item in storage
   */
  static async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const serialized = JSON.stringify(value);
      await AsyncStorage.setItem(key, serialized);
    } catch (error) {
      console.error(`Failed to set item ${key}:`, error);
      throw error;
    }
  }

  /**
   * Get item from storage
   */
  static async getItem<T>(key: string, defaultValue?: T): Promise<T | null> {
    try {
      const item = await AsyncStorage.getItem(key);
      if (item === null) return defaultValue ?? null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Failed to get item ${key}:`, error);
      return defaultValue ?? null;
    }
  }

  /**
   * Remove item from storage
   */
  static async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove item ${key}:`, error);
      throw error;
    }
  }

  /**
   * Clear all storage
   */
  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Failed to clear storage:', error);
      throw error;
    }
  }

  /**
   * Get all keys
   */
  static async getAllKeys(): Promise<string[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return Array.from(keys);
    } catch (error) {
      console.error('Failed to get all keys:', error);
      return [];
    }
  }

  /**
   * Get multiple items
   */
  static async multiGet<T>(keys: string[]): Promise<Record<string, T | null>> {
    try {
      const items = await AsyncStorage.multiGet(keys);
      const result: Record<string, T | null> = {};

      items.forEach(([key, value]) => {
        result[key] = value ? (JSON.parse(value) as T) : null;
      });

      return result;
    } catch (error) {
      console.error('Failed to get multiple items:', error);
      return {};
    }
  }

  /**
   * Set multiple items
   */
  static async multiSet<T>(items: Record<string, T>): Promise<void> {
    try {
      const pairs: [string, string][] = Object.entries(items).map(([key, value]) => [
        key,
        JSON.stringify(value),
      ]);
      await AsyncStorage.multiSet(pairs);
    } catch (error) {
      console.error('Failed to set multiple items:', error);
      throw error;
    }
  }

  /**
   * Get storage size
   */
  static async getStorageSize(): Promise<number> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const items = await AsyncStorage.multiGet(keys);
      let size = 0;

      items.forEach(([, value]) => {
        if (value) {
          size += value.length;
        }
      });

      return size;
    } catch (error) {
      console.error('Failed to get storage size:', error);
      return 0;
    }
  }

  /**
   * Clear old cache
   */
  static async clearOldCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((key) => key.startsWith('@metodo_cache_'));

      for (const key of cacheKeys) {
        const item = await AsyncStorage.getItem(key);
        if (item) {
          const data = JSON.parse(item);
          const timestamp = data.timestamp || 0;
          const age = Date.now() - timestamp;

          if (age > STORAGE_CONFIG.cacheExpiration) {
            await AsyncStorage.removeItem(key);
          }
        }
      }
    } catch (error) {
      console.error('Failed to clear old cache:', error);
    }
  }

  /**
   * Get storage info
   */
  static async getStorageInfo(): Promise<{
    size: number;
    keys: number;
    items: Record<string, number>;
  }> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const items = await AsyncStorage.multiGet(keys);
      const info: Record<string, number> = {};
      let totalSize = 0;

      items.forEach(([key, value]) => {
        if (value) {
          const size = value.length;
          info[key] = size;
          totalSize += size;
        }
      });

      return {
        size: totalSize,
        keys: keys.length,
        items: info,
      };
    } catch (error) {
      console.error('Failed to get storage info:', error);
      return { size: 0, keys: 0, items: {} };
    }
  }
}

/**
 * Cache utility class
 */
export class CacheUtil {
  /**
   * Set cached item
   */
  static async setCached<T>(key: string, value: T, ttl?: number): Promise<void> {
    const cacheKey = `@metodo_cache_${key}`;
    const cacheData = {
      value,
      timestamp: Date.now(),
      ttl: ttl || STORAGE_CONFIG.cacheExpiration,
    };

    await StorageUtil.setItem(cacheKey, cacheData);
  }

  /**
   * Get cached item
   */
  static async getCached<T>(key: string): Promise<T | null> {
    const cacheKey = `@metodo_cache_${key}`;
    const cacheData = await StorageUtil.getItem<{
      value: T;
      timestamp: number;
      ttl: number;
    }>(cacheKey);

    if (!cacheData) return null;

    const age = Date.now() - cacheData.timestamp;
    if (age > cacheData.ttl) {
      await StorageUtil.removeItem(cacheKey);
      return null;
    }

    return cacheData.value;
  }

  /**
   * Clear cache
   */
  static async clearCache(key?: string): Promise<void> {
    if (key) {
      const cacheKey = `@metodo_cache_${key}`;
      await StorageUtil.removeItem(cacheKey);
    } else {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((k) => k.startsWith('@metodo_cache_'));

      for (const cacheKey of cacheKeys) {
        await StorageUtil.removeItem(cacheKey);
      }
    }
  }

  /**
   * Get cache size
   */
  static async getCacheSize(): Promise<number> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((key) => key.startsWith('@metodo_cache_'));
      const items = await AsyncStorage.multiGet(cacheKeys);
      let size = 0;

      items.forEach(([, value]) => {
        if (value) {
          size += value.length;
        }
      });

      return size;
    } catch (error) {
      console.error('Failed to get cache size:', error);
      return 0;
    }
  }
}

/**
 * Session utility class
 */
export class SessionUtil {
  /**
   * Set session data
   */
  static async setSession<T>(key: string, value: T): Promise<void> {
    const sessionKey = `@metodo_session_${key}`;
    const sessionData = {
      value,
      timestamp: Date.now(),
    };

    await StorageUtil.setItem(sessionKey, sessionData);
  }

  /**
   * Get session data
   */
  static async getSession<T>(key: string): Promise<T | null> {
    const sessionKey = `@metodo_session_${key}`;
    const sessionData = await StorageUtil.getItem<{
      value: T;
      timestamp: number;
    }>(sessionKey);

    if (!sessionData) return null;

    const age = Date.now() - sessionData.timestamp;
    if (age > STORAGE_CONFIG.sessionExpiration) {
      await StorageUtil.removeItem(sessionKey);
      return null;
    }

    return sessionData.value;
  }

  /**
   * Clear session
   */
  static async clearSession(key?: string): Promise<void> {
    if (key) {
      const sessionKey = `@metodo_session_${key}`;
      await StorageUtil.removeItem(sessionKey);
    } else {
      const keys = await AsyncStorage.getAllKeys();
      const sessionKeys = keys.filter((k) => k.startsWith('@metodo_session_'));

      for (const sessionKey of sessionKeys) {
        await StorageUtil.removeItem(sessionKey);
      }
    }
  }
}

export default {
  StorageUtil,
  CacheUtil,
  SessionUtil,
};
