// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

/**
 * FILE PURPOSE: Validation Utilities
 * 
 * Comprehensive validation utilities for MeTodo including
 * input validation, data validation, and format checking.
 * 
 * Features:
 * - Email validation
 * - URL validation
 * - Phone validation
 * - Input validation
 * - Data type checking
 */

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL
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
 * Validate phone number
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

/**
 * Validate password
 */
export function isValidPassword(password: string): boolean {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

/**
 * Validate username
 */
export function isValidUsername(username: string): boolean {
  // 3-20 characters, alphanumeric and underscore only
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

/**
 * Validate credit card
 */
export function isValidCreditCard(cardNumber: string): boolean {
  const sanitized = cardNumber.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(sanitized)) return false;

  // Luhn algorithm
  let sum = 0;
  let isEven = false;

  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Validate string length
 */
export function isValidLength(
  str: string,
  minLength: number,
  maxLength: number
): boolean {
  return str.length >= minLength && str.length <= maxLength;
}

/**
 * Validate string is not empty
 */
export function isNotEmpty(str: string): boolean {
  return str.trim().length > 0;
}

/**
 * Validate string contains only letters
 */
export function isOnlyLetters(str: string): boolean {
  return /^[a-zA-Z\s]*$/.test(str);
}

/**
 * Validate string contains only numbers
 */
export function isOnlyNumbers(str: string): boolean {
  return /^\d+$/.test(str);
}

/**
 * Validate string contains only alphanumeric
 */
export function isAlphanumeric(str: string): boolean {
  return /^[a-zA-Z0-9]*$/.test(str);
}

/**
 * Validate string is uppercase
 */
export function isUppercase(str: string): boolean {
  return str === str.toUpperCase();
}

/**
 * Validate string is lowercase
 */
export function isLowercase(str: string): boolean {
  return str === str.toLowerCase();
}

/**
 * Validate JSON string
 */
export function isValidJSON(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate date
 */
export function isValidDate(date: any): boolean {
  if (!(date instanceof Date)) return false;
  return !isNaN(date.getTime());
}

/**
 * Validate number is in range
 */
export function isInRange(num: number, min: number, max: number): boolean {
  return num >= min && num <= max;
}

/**
 * Validate number is positive
 */
export function isPositive(num: number): boolean {
  return num > 0;
}

/**
 * Validate number is negative
 */
export function isNegative(num: number): boolean {
  return num < 0;
}

/**
 * Validate number is integer
 */
export function isInteger(num: number): boolean {
  return Number.isInteger(num);
}

/**
 * Validate number is float
 */
export function isFloat(num: number): boolean {
  return !Number.isInteger(num);
}

/**
 * Validate array is not empty
 */
export function isArrayNotEmpty<T>(arr: T[]): boolean {
  return Array.isArray(arr) && arr.length > 0;
}

/**
 * Validate array length
 */
export function isArrayLength<T>(arr: T[], length: number): boolean {
  return Array.isArray(arr) && arr.length === length;
}

/**
 * Validate object has property
 */
export function hasProperty(obj: any, prop: string): boolean {
  return obj && typeof obj === 'object' && prop in obj;
}

/**
 * Validate object has all properties
 */
export function hasAllProperties(obj: any, props: string[]): boolean {
  if (!obj || typeof obj !== 'object') return false;
  return props.every((prop) => prop in obj);
}

/**
 * Validate object is empty
 */
export function isObjectEmpty(obj: any): boolean {
  if (typeof obj !== 'object' || obj === null) return true;
  return Object.keys(obj).length === 0;
}

/**
 * Validate value is null or undefined
 */
export function isNullOrUndefined(value: any): boolean {
  return value === null || value === undefined;
}

/**
 * Validate value is defined
 */
export function isDefined(value: any): boolean {
  return value !== null && value !== undefined;
}

/**
 * Validate value type
 */
export function isType(value: any, type: string): boolean {
  if (type === 'array') {
    return Array.isArray(value);
  }
  return typeof value === type;
}

/**
 * Validate task title
 */
export function isValidTaskTitle(title: string): boolean {
  return isNotEmpty(title) && isValidLength(title, 1, 200);
}

/**
 * Validate task description
 */
export function isValidTaskDescription(description: string): boolean {
  return isValidLength(description, 0, 5000);
}

/**
 * Validate task priority
 */
export function isValidTaskPriority(priority: string): boolean {
  return ['low', 'medium', 'high', 'urgent'].includes(priority);
}

/**
 * Validate task status
 */
export function isValidTaskStatus(status: string): boolean {
  return ['pending', 'in-progress', 'completed', 'cancelled'].includes(status);
}

/**
 * Validate task category
 */
export function isValidTaskCategory(category: string): boolean {
  return isNotEmpty(category) && isValidLength(category, 1, 50);
}

/**
 * Validate task tag
 */
export function isValidTaskTag(tag: string): boolean {
  return isNotEmpty(tag) && isValidLength(tag, 1, 30);
}

/**
 * Validate recurring pattern
 */
export function isValidRecurringPattern(pattern: string): boolean {
  return ['daily', 'weekly', 'monthly', 'yearly'].includes(pattern);
}

/**
 * Validate color hex
 */
export function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Validate RGB color
 */
export function isValidRGBColor(color: string): boolean {
  return /^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(color);
}

/**
 * Validate RGBA color
 */
export function isValidRGBAColor(color: string): boolean {
  return /^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/.test(color);
}

/**
 * Validate color
 */
export function isValidColor(color: string): boolean {
  return isValidHexColor(color) || isValidRGBColor(color) || isValidRGBAColor(color);
}

export default {
  isValidEmail,
  isValidUrl,
  isValidPhone,
  isValidPassword,
  isValidUsername,
  isValidCreditCard,
  isValidLength,
  isNotEmpty,
  isOnlyLetters,
  isOnlyNumbers,
  isAlphanumeric,
  isUppercase,
  isLowercase,
  isValidJSON,
  isValidDate,
  isInRange,
  isPositive,
  isNegative,
  isInteger,
  isFloat,
  isArrayNotEmpty,
  isArrayLength,
  hasProperty,
  hasAllProperties,
  isObjectEmpty,
  isNullOrUndefined,
  isDefined,
  isType,
  isValidTaskTitle,
  isValidTaskDescription,
  isValidTaskPriority,
  isValidTaskStatus,
  isValidTaskCategory,
  isValidTaskTag,
  isValidRecurringPattern,
  isValidHexColor,
  isValidRGBColor,
  isValidRGBAColor,
  isValidColor,
};
