// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

/**
 * FILE PURPOSE: Formatting & Display Utilities
 * 
 * Comprehensive formatting and display utilities for MeTodo including
 * text formatting, number formatting, and display helpers.
 * 
 * Features:
 * - Text formatting
 * - Number formatting
 * - Currency formatting
 * - Display helpers
 */

/**
 * Truncate text
 */
export function truncateText(text: string, length: number, suffix: string = '...'): string {
  if (text.length <= length) return text;
  return text.substring(0, length - suffix.length) + suffix;
}

/**
 * Capitalize first letter
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Capitalize all words
 */
export function capitalizeWords(text: string): string {
  return text
    .split(' ')
    .map((word) => capitalize(word))
    .join(' ');
}

/**
 * Convert to slug
 */
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Format number with commas
 */
export function formatNumber(num: number, decimals: number = 0): string {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Format currency
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(2)} ${units[unitIndex]}`;
}

/**
 * Format phone number
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }

  if (cleaned.length === 11) {
    return `+${cleaned[0]} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }

  return phone;
}

/**
 * Format credit card
 */
export function formatCreditCard(card: string): string {
  const cleaned = card.replace(/\D/g, '');
  return cleaned.replace(/(\d{4})/g, '$1 ').trim();
}

/**
 * Highlight text
 */
export function highlightText(text: string, query: string, className: string = 'highlight'): string {
  if (!query) return text;

  const regex = new RegExp(`(${query})`, 'gi');
  return text.replace(regex, `<mark class="${className}">$1</mark>`);
}

/**
 * Strip HTML tags
 */
export function stripHTMLTags(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Escape HTML
 */
export function escapeHTML(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };

  return text.replace(/[&<>"']/g, (char) => map[char]);
}

/**
 * Unescape HTML
 */
export function unescapeHTML(text: string): string {
  const map: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#039;': "'",
  };

  return text.replace(/&[^;]+;/g, (entity) => map[entity] || entity);
}

/**
 * Format task priority
 */
export function formatTaskPriority(priority: string): string {
  const priorityMap: Record<string, string> = {
    low: '🟢 Low',
    medium: '🟡 Medium',
    high: '🔴 High',
    urgent: '🔴 Urgent',
  };

  return priorityMap[priority] || priority;
}

/**
 * Format task status
 */
export function formatTaskStatus(status: string): string {
  const statusMap: Record<string, string> = {
    pending: '⏳ Pending',
    'in-progress': '⚙️ In Progress',
    completed: '✅ Completed',
    cancelled: '❌ Cancelled',
  };

  return statusMap[status] || status;
}

/**
 * Get priority color
 */
export function getPriorityColor(priority: string): string {
  const colorMap: Record<string, string> = {
    low: '#22C55E',
    medium: '#F59E0B',
    high: '#EF4444',
    urgent: '#DC2626',
  };

  return colorMap[priority] || '#6B7280';
}

/**
 * Get status color
 */
export function getStatusColor(status: string): string {
  const colorMap: Record<string, string> = {
    pending: '#F59E0B',
    'in-progress': '#3B82F6',
    completed: '#22C55E',
    cancelled: '#6B7280',
  };

  return colorMap[status] || '#6B7280';
}

/**
 * Format duration
 */
export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor((milliseconds / 1000) % 60);
  const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
  const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
  const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));

  const parts: string[] = [];

  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0) parts.push(`${seconds}s`);

  return parts.join(' ') || '0s';
}

/**
 * Format bytes to readable size
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Format count with suffix
 */
export function formatCount(count: number): string {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  }

  if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }

  return count.toString();
}

/**
 * Format ordinal number
 */
export function formatOrdinal(num: number): string {
  const j = num % 10;
  const k = num % 100;

  if (j === 1 && k !== 11) return num + 'st';
  if (j === 2 && k !== 12) return num + 'nd';
  if (j === 3 && k !== 13) return num + 'rd';

  return num + 'th';
}

/**
 * Format array to readable string
 */
export function formatArray(arr: string[], separator: string = ', ', lastSeparator: string = ' and '): string {
  if (arr.length === 0) return '';
  if (arr.length === 1) return arr[0];
  if (arr.length === 2) return arr.join(lastSeparator);

  return arr.slice(0, -1).join(separator) + lastSeparator + arr[arr.length - 1];
}

/**
 * Format initials from name
 */
export function formatInitials(name: string): string {
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Format email domain
 */
export function formatEmailDomain(email: string): string {
  const domain = email.split('@')[1];
  return domain || '';
}

/**
 * Format URL display
 */
export function formatURLDisplay(url: string, maxLength: number = 50): string {
  try {
    const urlObj = new URL(url);
    const display = urlObj.hostname + urlObj.pathname;
    return truncateText(display, maxLength);
  } catch {
    return truncateText(url, maxLength);
  }
}

export default {
  truncateText,
  capitalize,
  capitalizeWords,
  toSlug,
  formatNumber,
  formatCurrency,
  formatPercentage,
  formatFileSize,
  formatPhoneNumber,
  formatCreditCard,
  highlightText,
  stripHTMLTags,
  escapeHTML,
  unescapeHTML,
  formatTaskPriority,
  formatTaskStatus,
  getPriorityColor,
  getStatusColor,
  formatDuration,
  formatBytes,
  formatCount,
  formatOrdinal,
  formatArray,
  formatInitials,
  formatEmailDomain,
  formatURLDisplay,
};
