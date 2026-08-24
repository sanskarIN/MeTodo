// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

/**
 * FILE PURPOSE: Analytics Service
 * 
 * This service handles all analytics and productivity tracking for MeTodo.
 * Tracks task completion rates, productivity metrics, user patterns, and
 * generates insights for the analytics dashboard.
 * 
 * Features:
 * - Track task completion rates
 * - Calculate productivity metrics
 * - Generate daily/weekly/monthly reports
 * - Identify productivity patterns
 * - Track time spent on tasks
 * - Category performance analysis
 */

/**
 * Analytics data interface
 */
export interface AnalyticsData {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  completionRate: number;
  averageTasksPerDay: number;
  mostProductiveHour: number;
  mostProductiveDay: string;
  categoryStats: Record<string, CategoryStats>;
  dailyStats: DailyStats[];
  weeklyStats: WeeklyStats[];
}

/**
 * Category statistics interface
 */
export interface CategoryStats {
  name: string;
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  completionRate: number;
  averageTimeSpent: number;
}

/**
 * Daily statistics interface
 */
export interface DailyStats {
  date: string;
  tasksCreated: number;
  tasksCompleted: number;
  tasksOverdue: number;
  completionRate: number;
  timeSpent: number;
}

/**
 * Weekly statistics interface
 */
export interface WeeklyStats {
  week: number;
  year: number;
  tasksCreated: number;
  tasksCompleted: number;
  completionRate: number;
  averageDailyCompletion: number;
}

/**
 * Productivity insight interface
 */
export interface ProductivityInsight {
  type: string;
  title: string;
  description: string;
  value: number | string;
  trend: 'up' | 'down' | 'stable';
  recommendation: string;
}

/**
 * Analytics Service Class
 * 
 * Handles all analytics operations including data collection, calculation,
 * and report generation.
 */
export class AnalyticsService {
  private static instance: AnalyticsService;
  private analyticsData: AnalyticsData = {
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    completionRate: 0,
    averageTasksPerDay: 0,
    mostProductiveHour: 0,
    mostProductiveDay: '',
    categoryStats: {},
    dailyStats: [],
    weeklyStats: [],
  };

  private constructor() {}

  /**
   * Get singleton instance
   */
  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  /**
   * Calculate completion rate
   */
  calculateCompletionRate(completed: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  }

  /**
   * Calculate average tasks per day
   */
  calculateAverageTasksPerDay(totalTasks: number, days: number): number {
    if (days === 0) return 0;
    return Math.round(totalTasks / days);
  }

  /**
   * Get productivity insights
   */
  getProductivityInsights(): ProductivityInsight[] {
    const insights: ProductivityInsight[] = [];

    // Completion rate insight
    insights.push({
      type: 'completion_rate',
      title: 'Task Completion Rate',
      description: 'Percentage of tasks completed',
      value: `${this.analyticsData.completionRate}%`,
      trend: this.analyticsData.completionRate > 70 ? 'up' : 'down',
      recommendation:
        this.analyticsData.completionRate > 70
          ? 'Great job! Keep up the momentum.'
          : 'Try to increase your completion rate by breaking tasks into smaller steps.',
    });

    // Most productive hour insight
    insights.push({
      type: 'productive_hour',
      title: 'Most Productive Hour',
      description: 'Time of day when you complete most tasks',
      value: `${this.analyticsData.mostProductiveHour}:00`,
      trend: 'stable',
      recommendation: `Schedule important tasks during ${this.analyticsData.mostProductiveHour}:00 for maximum productivity.`,
    });

    // Overdue tasks insight
    insights.push({
      type: 'overdue_tasks',
      title: 'Overdue Tasks',
      description: 'Number of tasks past their due date',
      value: this.analyticsData.overdueTasks,
      trend: this.analyticsData.overdueTasks > 0 ? 'down' : 'up',
      recommendation:
        this.analyticsData.overdueTasks > 0
          ? 'Focus on completing overdue tasks first.'
          : 'Excellent! No overdue tasks.',
    });

    return insights;
  }

  /**
   * Get daily statistics for a date range
   */
  getDailyStats(startDate: Date, endDate: Date): DailyStats[] {
    return this.analyticsData.dailyStats.filter((stat) => {
      const date = new Date(stat.date);
      return date >= startDate && date <= endDate;
    });
  }

  /**
   * Get weekly statistics
   */
  getWeeklyStats(weeks: number = 4): WeeklyStats[] {
    return this.analyticsData.weeklyStats.slice(-weeks);
  }

  /**
   * Get category statistics
   */
  getCategoryStats(): CategoryStats[] {
    return Object.values(this.analyticsData.categoryStats);
  }

  /**
   * Get most productive category
   */
  getMostProductiveCategory(): CategoryStats | null {
    const categories = Object.values(this.analyticsData.categoryStats);
    if (categories.length === 0) return null;

    return categories.reduce((max, current) =>
      current.completionRate > max.completionRate ? current : max
    );
  }

  /**
   * Get least productive category
   */
  getLeastProductiveCategory(): CategoryStats | null {
    const categories = Object.values(this.analyticsData.categoryStats);
    if (categories.length === 0) return null;

    return categories.reduce((min, current) =>
      current.completionRate < min.completionRate ? current : min
    );
  }

  /**
   * Get completion trend (last 7 days)
   */
  getCompletionTrend(): number[] {
    const lastSevenDays = this.analyticsData.dailyStats.slice(-7);
    return lastSevenDays.map((stat) => stat.completionRate);
  }

  /**
   * Get productivity score (0-100)
   */
  getProductivityScore(): number {
    const completionRate = this.analyticsData.completionRate;
    const onTimeRate = this.calculateOnTimeRate();
    const consistencyScore = this.calculateConsistencyScore();

    return Math.round((completionRate * 0.5 + onTimeRate * 0.3 + consistencyScore * 0.2) / 100);
  }

  /**
   * Calculate on-time completion rate
   */
  private calculateOnTimeRate(): number {
    if (this.analyticsData.completedTasks === 0) return 0;
    const onTimeCount = this.analyticsData.completedTasks - this.analyticsData.overdueTasks;
    return Math.round((onTimeCount / this.analyticsData.completedTasks) * 100);
  }

  /**
   * Calculate consistency score
   */
  private calculateConsistencyScore(): number {
    if (this.analyticsData.dailyStats.length === 0) return 0;

    const completionRates = this.analyticsData.dailyStats.map((stat) => stat.completionRate);
    const average = completionRates.reduce((a, b) => a + b, 0) / completionRates.length;
    const variance =
      completionRates.reduce((sum, rate) => sum + Math.pow(rate - average, 2), 0) /
      completionRates.length;
    const stdDev = Math.sqrt(variance);

    // Lower standard deviation = higher consistency
    return Math.max(0, 100 - stdDev);
  }

  /**
   * Get performance comparison (this month vs last month)
   */
  getPerformanceComparison(): {
    thisMonth: number;
    lastMonth: number;
    change: number;
  } {
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const thisMonthStats = this.getDailyStats(thisMonthStart, now);
    const lastMonthStats = this.getDailyStats(lastMonthStart, lastMonthEnd);

    const thisMonthAvg =
      thisMonthStats.length > 0
        ? Math.round(
            thisMonthStats.reduce((sum, stat) => sum + stat.completionRate, 0) /
              thisMonthStats.length
          )
        : 0;

    const lastMonthAvg =
      lastMonthStats.length > 0
        ? Math.round(
            lastMonthStats.reduce((sum, stat) => sum + stat.completionRate, 0) /
              lastMonthStats.length
          )
        : 0;

    return {
      thisMonth: thisMonthAvg,
      lastMonth: lastMonthAvg,
      change: thisMonthAvg - lastMonthAvg,
    };
  }

  /**
   * Update analytics data
   */
  updateAnalyticsData(data: Partial<AnalyticsData>): void {
    this.analyticsData = { ...this.analyticsData, ...data };
  }

  /**
   * Get all analytics data
   */
  getAllAnalyticsData(): AnalyticsData {
    return { ...this.analyticsData };
  }

  /**
   * Reset analytics data
   */
  resetAnalyticsData(): void {
    this.analyticsData = {
      totalTasks: 0,
      completedTasks: 0,
      pendingTasks: 0,
      overdueTasks: 0,
      completionRate: 0,
      averageTasksPerDay: 0,
      mostProductiveHour: 0,
      mostProductiveDay: '',
      categoryStats: {},
      dailyStats: [],
      weeklyStats: [],
    };
  }
}

// Export singleton instance
export const analyticsService = AnalyticsService.getInstance();
