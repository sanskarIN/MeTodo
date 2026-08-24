// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

/**
 * FILE PURPOSE: Extended Utility Functions
 * 
 * This file contains comprehensive utility functions for MeTodo including
 * string manipulation, array operations, object utilities, and common helpers
 * used throughout the application.
 * 
 * Features:
 * - String utilities (capitalize, truncate, slug)
 * - Array utilities (unique, flatten, chunk)
 * - Object utilities (merge, pick, omit)
 * - Common helpers (debounce, throttle, retry)
 */

/**
 * Capitalize first letter of string
 * 
 * @example
 * ```ts
 * capitalize('hello') // 'Hello'
 * ```
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Truncate string to specified length
 * 
 * @example
 * ```ts
 * truncate('Hello World', 5) // 'He...'
 * ```
 */
export function truncate(str: string, length: number, suffix: string = '...'): string {
  if (str.length <= length) return str;
  return str.slice(0, length - suffix.length) + suffix;
}

/**
 * Convert string to slug format
 * 
 * @example
 * ```ts
 * toSlug('Hello World') // 'hello-world'
 * ```
 */
export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Reverse string
 * 
 * @example
 * ```ts
 * reverseString('hello') // 'olleh'
 * ```
 */
export function reverseString(str: string): string {
  return str.split('').reverse().join('');
}

/**
 * Check if string is palindrome
 * 
 * @example
 * ```ts
 * isPalindrome('racecar') // true
 * ```
 */
export function isPalindrome(str: string): boolean {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
  return cleaned === reverseString(cleaned);
}

/**
 * Count occurrences of substring
 * 
 * @example
 * ```ts
 * countOccurrences('hello hello', 'hello') // 2
 * ```
 */
export function countOccurrences(str: string, substr: string): number {
  if (!substr) return 0;
  return str.split(substr).length - 1;
}

/**
 * Get unique values from array
 * 
 * @example
 * ```ts
 * unique([1, 2, 2, 3]) // [1, 2, 3]
 * ```
 */
export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

/**
 * Flatten nested array
 * 
 * @example
 * ```ts
 * flatten([[1, 2], [3, 4]]) // [1, 2, 3, 4]
 * ```
 */
export function flatten<T>(arr: (T | T[])[]): T[] {
  return arr.reduce((flat: T[], item) => {
    return flat.concat(Array.isArray(item) ? flatten(item as T[]) : (item as T));
  }, [] as T[]);
}

/**
 * Chunk array into smaller arrays
 * 
 * @example
 * ```ts
 * chunk([1, 2, 3, 4, 5], 2) // [[1, 2], [3, 4], [5]]
 * ```
 */
export function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

/**
 * Shuffle array
 * 
 * @example
 * ```ts
 * shuffle([1, 2, 3, 4, 5]) // [3, 1, 4, 5, 2]
 * ```
 */
export function shuffle<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Group array by key
 * 
 * @example
 * ```ts
 * groupBy([{type: 'a', val: 1}, {type: 'b', val: 2}], 'type')
 * // {a: [{type: 'a', val: 1}], b: [{type: 'b', val: 2}]}
 * ```
 */
export function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
}

/**
 * Merge objects
 * 
 * @example
 * ```ts
 * merge({a: 1}, {b: 2}) // {a: 1, b: 2}
 * ```
 */
export function merge<T extends Record<string, any>>(
  ...objects: Partial<T>[]
): Partial<T> {
  return objects.reduce((result, obj) => {
    return { ...result, ...obj };
  }, {} as Partial<T>);
}

/**
 * Pick specific keys from object
 * 
 * @example
 * ```ts
 * pick({a: 1, b: 2, c: 3}, ['a', 'b']) // {a: 1, b: 2}
 * ```
 */
export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  return keys.reduce((result, key) => {
    result[key] = obj[key];
    return result;
  }, {} as Pick<T, K>);
}

/**
 * Omit specific keys from object
 * 
 * @example
 * ```ts
 * omit({a: 1, b: 2, c: 3}, ['b']) // {a: 1, c: 3}
 * ```
 */
export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => {
    delete result[key];
  });
  return result;
}

/**
 * Deep clone object
 * 
 * @example
 * ```ts
 * deepClone({a: {b: 1}}) // {a: {b: 1}} (new reference)
 * ```
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map((item) => deepClone(item)) as any;
  if (obj instanceof Object) {
    const cloned = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  return obj;
}

/**
 * Debounce function
 * 
 * @example
 * ```ts
 * const debouncedSearch = debounce((query) => search(query), 300)
 * ```
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: any = null;

  return function (...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
      timeout = null;
    }, wait);
  };
}

/**
 * Throttle function
 * 
 * @example
 * ```ts
 * const throttledScroll = throttle(() => handleScroll(), 200)
 * ```
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Retry async function
 * 
 * @example
 * ```ts
 * await retry(() => fetchData(), 3, 1000)
 * ```
 */
export async function retry<T>(
  func: () => Promise<T>,
  attempts: number = 3,
  delay: number = 1000
): Promise<T> {
  for (let i = 0; i < attempts; i++) {
    try {
      return await func();
    } catch (error) {
      if (i === attempts - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error('Retry failed');
}

/**
 * Wait for specified milliseconds
 * 
 * @example
 * ```ts
 * await wait(1000) // Wait 1 second
 * ```
 */
export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate random ID
 * 
 * @example
 * ```ts
 * generateId() // 'abc123xyz'
 * ```
 */
export function generateId(length: number = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

/**
 * Generate UUID
 * 
 * @example
 * ```ts
 * generateUUID() // '550e8400-e29b-41d4-a716-446655440000'
 * ```
 */
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Check if value is empty
 * 
 * @example
 * ```ts
 * isEmpty('') // true
 * isEmpty([]) // true
 * isEmpty({}) // true
 * ```
 */
export function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Check if value is valid email
 * 
 * @example
 * ```ts
 * isValidEmail('test@example.com') // true
 * ```
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if value is valid URL
 * 
 * @example
 * ```ts
 * isValidUrl('https://example.com') // true
 * ```
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Parse JSON safely
 * 
 * @example
 * ```ts
 * parseJSON('{"a": 1}') // {a: 1}
 * parseJSON('invalid') // null
 * ```
 */
export function parseJSON<T>(json: string, fallback: T | null = null): T | null {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/**
 * Format bytes to human readable
 * 
 * @example
 * ```ts
 * formatBytes(1024) // '1 KB'
 * ```
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Calculate percentage
 * 
 * @example
 * ```ts
 * calculatePercentage(25, 100) // 25
 * ```
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Get random item from array
 * 
 * @example
 * ```ts
 * randomItem([1, 2, 3]) // 2
 * ```
 */
export function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Sum array values
 * 
 * @example
 * ```ts
 * sum([1, 2, 3]) // 6
 * ```
 */
export function sum(arr: number[]): number {
  return arr.reduce((total, num) => total + num, 0);
}

/**
 * Calculate average
 * 
 * @example
 * ```ts
 * average([1, 2, 3]) // 2
 * ```
 */
export function average(arr: number[]): number {
  if (arr.length === 0) return 0;
  return sum(arr) / arr.length;
}

/**
 * Get min value from array
 * 
 * @example
 * ```ts
 * min([3, 1, 2]) // 1
 * ```
 */
export function min(arr: number[]): number {
  return Math.min(...arr);
}

/**
 * Get max value from array
 * 
 * @example
 * ```ts
 * max([3, 1, 2]) // 3
 * ```
 */
export function max(arr: number[]): number {
  return Math.max(...arr);
}
