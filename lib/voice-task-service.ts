// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

/**
 * FILE PURPOSE: Voice Task Service
 * 
 * Service for creating tasks through voice input using speech-to-text
 * technology. Allows hands-free task creation for better accessibility.
 * 
 * Features:
 * - Speech-to-text conversion
 * - Natural language processing
 * - Task extraction from voice input
 * - Priority and category detection
 * - Voice feedback
 */

/**
 * Voice task input interface
 */
export interface VoiceTaskInput {
  text: string;
  confidence: number;
  duration: number;
  language: string;
}

/**
 * Extracted task interface
 */
export interface ExtractedTask {
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  dueDate?: Date;
  tags?: string[];
  confidence: number;
}

/**
 * Voice Task Service Class
 */
export class VoiceTaskService {
  private isListening: boolean = false;
  private recognitionText: string = '';
  private confidence: number = 0;

  /**
   * Constructor
   */
  constructor() {}

  /**
   * Start listening for voice input
   */
  async startListening(): Promise<void> {
    this.isListening = true;
    this.recognitionText = '';
    this.confidence = 0;
  }

  /**
   * Stop listening
   */
  stopListening(): void {
    this.isListening = false;
  }

  /**
   * Process voice input
   */
  processVoiceInput(text: string, confidence: number = 0.9): VoiceTaskInput {
    return {
      text,
      confidence,
      duration: 0,
      language: 'en-US',
    };
  }

  /**
   * Extract task from voice input
   */
  extractTaskFromVoice(voiceInput: VoiceTaskInput): ExtractedTask {
    const text = voiceInput.text.toLowerCase();
    const words = text.split(' ');

    // Extract title (first few words)
    const title = this.extractTitle(text);

    // Extract priority
    const priority = this.extractPriority(text);

    // Extract category
    const category = this.extractCategory(text);

    // Extract due date
    const dueDate = this.extractDueDate(text);

    // Extract tags
    const tags = this.extractTags(text);

    // Extract description
    const description = this.extractDescription(text);

    return {
      title,
      description,
      priority,
      category,
      dueDate,
      tags,
      confidence: voiceInput.confidence,
    };
  }

  /**
   * Extract title from text
   */
  private extractTitle(text: string): string {
    // Remove common prefixes
    let title = text
      .replace(/^(create|add|new|make|set) /, '')
      .replace(/^(task|todo|reminder) /, '');

    // Take first 3-5 words as title
    const words = title.split(' ');
    const titleWords = words.slice(0, Math.min(5, words.length));

    return titleWords.join(' ').charAt(0).toUpperCase() + titleWords.join(' ').slice(1);
  }

  /**
   * Extract priority from text
   */
  private extractPriority(text: string): 'low' | 'medium' | 'high' | undefined {
    if (text.includes('urgent') || text.includes('asap') || text.includes('high priority')) {
      return 'high';
    }
    if (text.includes('low priority') || text.includes('whenever')) {
      return 'low';
    }
    if (text.includes('medium') || text.includes('normal')) {
      return 'medium';
    }
    return undefined;
  }

  /**
   * Extract category from text
   */
  private extractCategory(text: string): string | undefined {
    const categories = [
      'work',
      'personal',
      'shopping',
      'health',
      'finance',
      'education',
      'home',
      'travel',
    ];

    for (const category of categories) {
      if (text.includes(category)) {
        return category;
      }
    }

    return undefined;
  }

  /**
   * Extract due date from text
   */
  private extractDueDate(text: string): Date | undefined {
    const now = new Date();

    // Today
    if (text.includes('today')) {
      return now;
    }

    // Tomorrow
    if (text.includes('tomorrow')) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow;
    }

    // This week
    if (text.includes('this week')) {
      const endOfWeek = new Date(now);
      endOfWeek.setDate(endOfWeek.getDate() + (5 - endOfWeek.getDay()));
      return endOfWeek;
    }

    // Next week
    if (text.includes('next week')) {
      const nextWeek = new Date(now);
      nextWeek.setDate(nextWeek.getDate() + 7);
      return nextWeek;
    }

    // This month
    if (text.includes('this month')) {
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return endOfMonth;
    }

    // Next month
    if (text.includes('next month')) {
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 2, 0);
      return nextMonth;
    }

    // In X days
    const daysMatch = text.match(/in (\d+) days?/);
    if (daysMatch) {
      const days = parseInt(daysMatch[1]);
      const date = new Date(now);
      date.setDate(date.getDate() + days);
      return date;
    }

    // In X weeks
    const weeksMatch = text.match(/in (\d+) weeks?/);
    if (weeksMatch) {
      const weeks = parseInt(weeksMatch[1]);
      const date = new Date(now);
      date.setDate(date.getDate() + weeks * 7);
      return date;
    }

    return undefined;
  }

  /**
   * Extract tags from text
   */
  private extractTags(text: string): string[] {
    const tags: string[] = [];

    // Extract hashtags
    const hashtagMatches = text.match(/#\w+/g);
    if (hashtagMatches) {
      tags.push(...hashtagMatches.map((tag) => tag.substring(1)));
    }

    // Extract @mentions
    const mentionMatches = text.match(/@\w+/g);
    if (mentionMatches) {
      tags.push(...mentionMatches.map((mention) => mention.substring(1)));
    }

    return tags;
  }

  /**
   * Extract description from text
   */
  private extractDescription(text: string): string | undefined {
    // Remove task-related keywords
    let description = text
      .replace(/^(create|add|new|make|set) /, '')
      .replace(/^(task|todo|reminder) /, '')
      .replace(/(urgent|asap|high priority|low priority|medium|normal)/gi, '')
      .replace(/(today|tomorrow|this week|next week|this month|next month)/gi, '')
      .replace(/in \d+ (days?|weeks?)/gi, '')
      .replace(/#\w+/g, '')
      .replace(/@\w+/g, '')
      .trim();

    return description.length > 0 ? description : undefined;
  }

  /**
   * Get listening status
   */
  isCurrentlyListening(): boolean {
    return this.isListening;
  }

  /**
   * Get recognition text
   */
  getRecognitionText(): string {
    return this.recognitionText;
  }

  /**
   * Get confidence level
   */
  getConfidence(): number {
    return this.confidence;
  }

  /**
   * Clear recognition data
   */
  clearRecognition(): void {
    this.recognitionText = '';
    this.confidence = 0;
  }

  /**
   * Validate extracted task
   */
  validateTask(task: ExtractedTask): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!task.title || task.title.trim().length === 0) {
      errors.push('Task title is required');
    }

    if (task.title && task.title.length > 200) {
      errors.push('Task title is too long (max 200 characters)');
    }

    if (task.description && task.description.length > 1000) {
      errors.push('Task description is too long (max 1000 characters)');
    }

    if (task.confidence < 0.5) {
      errors.push('Voice recognition confidence too low');
    }

    if (task.dueDate && task.dueDate < new Date()) {
      errors.push('Due date cannot be in the past');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get voice input suggestions
   */
  getSuggestions(): string[] {
    return [
      'Create a task called "Buy groceries"',
      'Add a high priority work task for tomorrow',
      'Set a reminder for this week about project deadline',
      'Create a personal task with tag #health',
      'Add a task due in 3 days',
    ];
  }
}

export const voiceTaskService = new VoiceTaskService();
export default VoiceTaskService;
