// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

/**
 * FILE PURPOSE: Analytics Data Service
 * 
 * Comprehensive analytics service for MeTodo providing detailed productivity
 * metrics, trends analysis, and performance insights.
 * 
 * Features:
 * - Task completion analytics
 * - Productivity trends
 * - Category performance
 * - Time-based analytics
 * - Statistical calculations
 */

/**
 * Daily statistics interface
 */
export interface DailyStats {
  date: Date;
  tasksCreated: number;
  tasksCompleted: number;
  tasksOverdue: number;
  completionRate: number;
  averageCompletionTime: number;
}

/**
 * Category statistics interface
 */
export interface CategoryStats {
  category: string;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  averageCompletionTime: number;
  overdueTasks: number;
}

/**
 * Category statistics across two reporting windows.
 */
export interface CategoryComparison {
  category: string;
  currentTotalTasks: number;
  previousTotalTasks: number;
  currentCompletedTasks: number;
  previousCompletedTasks: number;
  currentCompletionRate: number;
  previousCompletionRate: number;
  completionRateDelta: number;
}

/**
 * Priority statistics interface
 */
export interface PriorityStats {
  priority: string;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
  averageCompletionTime: number;
}

/**
 * Priority statistics across two reporting windows.
 */
export interface PriorityComparison {
  priority: string;
  currentTotalTasks: number;
  previousTotalTasks: number;
  currentCompletedTasks: number;
  previousCompletedTasks: number;
  currentCompletionRate: number;
  previousCompletionRate: number;
  completionRateDelta: number;
}

/**
 * Productivity trend interface
 */
export interface ProductivityTrend {
  period: string;
  completionRate: number;
  tasksCompleted: number;
  averageCompletionTime: number;
  trend: 'up' | 'down' | 'stable';
}

/**
 * Time-based analytics interface
 */
export interface TimeBasedAnalytics {
  hour: number;
  tasksCompleted: number;
  averageCompletionTime: number;
}

/**
 * Analytics summary interface
 */
export interface AnalyticsSummary {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  completionRate: number;
  averageCompletionTime: number;
  mostProductiveDay: string;
  mostProductiveHour: number;
  favoriteCategory: string;
  streak: number;
}

/**
 * Inclusive date range used by the analytics dashboard.
 */
export interface AnalyticsDateRange {
  start: Date;
  end: Date;
}

/**
 * Current-versus-previous reporting-window comparison.
 */
export interface AnalyticsRangeComparison {
  currentRange: AnalyticsDateRange;
  previousRange: AnalyticsDateRange;
  current: AnalyticsSummary;
  previous: AnalyticsSummary;
  deltas: {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    overdueTasks: number;
    completionRate: number;
    streak: number;
  };
}

/**
 * Analytics Data Service Class
 */
export class AnalyticsDataService {
  private tasks: any[] = [];
  private dailyStats: Map<string, DailyStats> = new Map();
  private categoryStats: Map<string, CategoryStats> = new Map();
  private priorityStats: Map<string, PriorityStats> = new Map();
  private timeBasedAnalytics: TimeBasedAnalytics[] = [];

  /**
   * Constructor
   */
  constructor(tasks: any[] = []) {
    this.tasks = tasks;
    this.calculateAllStats();
  }

  /**
   * Update tasks
   */
  updateTasks(tasks: any[]): void {
    this.tasks = tasks;
    this.calculateAllStats();
  }

  /**
   * Calculate all statistics
   */
  private calculateAllStats(): void {
    this.calculateDailyStats();
    this.calculateCategoryStats();
    this.calculatePriorityStats();
    this.calculateTimeBasedAnalytics();
  }

  /**
   * Calculate daily statistics
   */
  private calculateDailyStats(): void {
    this.dailyStats.clear();
    const groupedByDate = this.groupTasksByDate();

    groupedByDate.forEach((dayTasks, dateStr) => {
      const completed = dayTasks.filter((t) => t.completed).length;
      const overdue = dayTasks.filter((t) => !t.completed && new Date(t.dueDate) < new Date()).length;
      const completionTimes = dayTasks
        .filter((t) => t.completed && t.completedAt)
        .map((t) => new Date(t.completedAt).getTime() - new Date(t.dueDate).getTime());

      const stats: DailyStats = {
        date: new Date(dateStr),
        tasksCreated: dayTasks.length,
        tasksCompleted: completed,
        tasksOverdue: overdue,
        completionRate: dayTasks.length > 0 ? completed / dayTasks.length : 0,
        averageCompletionTime: completionTimes.length > 0 ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length : 0,
      };

      this.dailyStats.set(dateStr, stats);
    });
  }

  /**
   * Calculate category statistics
   */
  private calculateCategoryStats(): void {
    this.categoryStats.clear();
    const groupedByCategory = this.groupTasksByCategory();

    groupedByCategory.forEach((categoryTasks, category) => {
      const completed = categoryTasks.filter((t) => t.completed).length;
      const overdue = categoryTasks.filter((t) => !t.completed && new Date(t.dueDate) < new Date()).length;
      const completionTimes = categoryTasks
        .filter((t) => t.completed && t.completedAt)
        .map((t) => new Date(t.completedAt).getTime() - new Date(t.dueDate).getTime());

      const stats: CategoryStats = {
        category,
        totalTasks: categoryTasks.length,
        completedTasks: completed,
        completionRate: categoryTasks.length > 0 ? completed / categoryTasks.length : 0,
        averageCompletionTime: completionTimes.length > 0 ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length : 0,
        overdueTasks: overdue,
      };

      this.categoryStats.set(category, stats);
    });
  }

  /**
   * Calculate priority statistics
   */
  private calculatePriorityStats(): void {
    this.priorityStats.clear();
    const groupedByPriority = this.groupTasksByPriority();

    groupedByPriority.forEach((priorityTasks, priority) => {
      const completed = priorityTasks.filter((t) => t.completed).length;
      const completionTimes = priorityTasks
        .filter((t) => t.completed && t.completedAt)
        .map((t) => new Date(t.completedAt).getTime() - new Date(t.dueDate).getTime());

      const stats: PriorityStats = {
        priority,
        totalTasks: priorityTasks.length,
        completedTasks: completed,
        completionRate: priorityTasks.length > 0 ? completed / priorityTasks.length : 0,
        averageCompletionTime: completionTimes.length > 0 ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length : 0,
      };

      this.priorityStats.set(priority, stats);
    });
  }

  /**
   * Calculate time-based analytics
   */
  private calculateTimeBasedAnalytics(): void {
    this.timeBasedAnalytics = [];
    const groupedByHour = this.groupTasksByHour();

    for (let hour = 0; hour < 24; hour++) {
      const hourTasks = groupedByHour.get(hour) || [];
      const completionTimes = hourTasks
        .filter((t) => t.completed && t.completedAt)
        .map((t) => new Date(t.completedAt).getTime() - new Date(t.dueDate).getTime());

      this.timeBasedAnalytics.push({
        hour,
        tasksCompleted: hourTasks.filter((t) => t.completed).length,
        averageCompletionTime: completionTimes.length > 0 ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length : 0,
      });
    }
  }

  private isTaskInRange(task: any, range: AnalyticsDateRange): boolean {
    const start = new Date(range.start).getTime();
    const end = new Date(range.end).getTime();
    const createdAt = new Date(task.createdAt).getTime();
    return createdAt >= start && createdAt <= end;
  }

  /**
   * Group tasks by date
   */
  private groupTasksByDate(): Map<string, any[]> {
    const grouped = new Map<string, any[]>();

    this.tasks.forEach((task) => {
      const dateStr = new Date(task.createdAt).toISOString().split('T')[0];
      if (!grouped.has(dateStr)) {
        grouped.set(dateStr, []);
      }
      grouped.get(dateStr)!.push(task);
    });

    return grouped;
  }

  /**
   * Group tasks by category
   */
  private groupTasksByCategory(): Map<string, any[]> {
    const grouped = new Map<string, any[]>();

    this.tasks.forEach((task) => {
      const category = task.category || 'Uncategorized';
      if (!grouped.has(category)) {
        grouped.set(category, []);
      }
      grouped.get(category)!.push(task);
    });

    return grouped;
  }

  /**
   * Group tasks by priority
   */
  private groupTasksByPriority(): Map<string, any[]> {
    const grouped = new Map<string, any[]>();

    this.tasks.forEach((task) => {
      const priority = task.priority || 'medium';
      if (!grouped.has(priority)) {
        grouped.set(priority, []);
      }
      grouped.get(priority)!.push(task);
    });

    return grouped;
  }

  /**
   * Group tasks by hour
   */
  private groupTasksByHour(): Map<number, any[]> {
    const grouped = new Map<number, any[]>();

    this.tasks.forEach((task) => {
      if (task.completedAt) {
        const hour = new Date(task.completedAt).getHours();
        if (!grouped.has(hour)) {
          grouped.set(hour, []);
        }
        grouped.get(hour)!.push(task);
      }
    });

    return grouped;
  }

  /**
   * Get daily statistics inside an inclusive date range.
   */
  getDailyStatsForRange(range: AnalyticsDateRange): DailyStats[] {
    const start = new Date(range.start);
    const end = new Date(range.end);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    return Array.from(this.dailyStats.values())
      .filter((stat) => stat.date >= start && stat.date <= end)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  /**
   * Get daily statistics for the most recent number of days.
   */
  getDailyStats(days: number = 30): DailyStats[] {
    const end = new Date();
    const start = new Date(end);
    start.setDate(start.getDate() - Math.max(days - 1, 0));
    return this.getDailyStatsForRange({ start, end });
  }

  /**
   * Get category statistics
   */
  getCategoryStats(): CategoryStats[] {
    return Array.from(this.categoryStats.values()).sort(
      (a, b) => b.completedTasks - a.completedTasks
    );
  }

  /**
   * Compare category performance across two inclusive reporting windows.
   */
  getCategoryComparison(
    currentRange: AnalyticsDateRange,
    previousRange: AnalyticsDateRange,
  ): CategoryComparison[] {
    const currentTasks = this.tasks.filter((task) => this.isTaskInRange(task, currentRange));
    const previousTasks = this.tasks.filter((task) => this.isTaskInRange(task, previousRange));
    const currentStats = new AnalyticsDataService(currentTasks).getCategoryStats();
    const previousStats = new AnalyticsDataService(previousTasks).getCategoryStats();
    const currentByCategory = new Map(currentStats.map((stat) => [stat.category, stat]));
    const previousByCategory = new Map(previousStats.map((stat) => [stat.category, stat]));
    const categories = new Set([...currentByCategory.keys(), ...previousByCategory.keys()]);

    return Array.from(categories)
      .map((category) => {
        const current = currentByCategory.get(category);
        const previous = previousByCategory.get(category);
        const currentCompletionRate = current?.completionRate ?? 0;
        const previousCompletionRate = previous?.completionRate ?? 0;
        return {
          category,
          currentTotalTasks: current?.totalTasks ?? 0,
          previousTotalTasks: previous?.totalTasks ?? 0,
          currentCompletedTasks: current?.completedTasks ?? 0,
          previousCompletedTasks: previous?.completedTasks ?? 0,
          currentCompletionRate,
          previousCompletionRate,
          completionRateDelta: currentCompletionRate - previousCompletionRate,
        };
      })
      .sort((a, b) => {
        const currentVolume = b.currentTotalTasks + b.previousTotalTasks;
        const nextVolume = a.currentTotalTasks + a.previousTotalTasks;
        return currentVolume - nextVolume || a.category.localeCompare(b.category);
      });
  }

  /**
   * Get priority statistics
   */
  getPriorityStats(): PriorityStats[] {
    return Array.from(this.priorityStats.values());
  }

  /**
   * Compare priority performance across two inclusive reporting windows.
   */
  getPriorityComparison(
    currentRange: AnalyticsDateRange,
    previousRange: AnalyticsDateRange,
  ): PriorityComparison[] {
    const currentTasks = this.tasks.filter((task) => this.isTaskInRange(task, currentRange));
    const previousTasks = this.tasks.filter((task) => this.isTaskInRange(task, previousRange));
    const currentStats = new AnalyticsDataService(currentTasks).getPriorityStats();
    const previousStats = new AnalyticsDataService(previousTasks).getPriorityStats();
    const currentByPriority = new Map(currentStats.map((stat) => [stat.priority, stat]));
    const previousByPriority = new Map(previousStats.map((stat) => [stat.priority, stat]));
    const priorities = new Set([...currentByPriority.keys(), ...previousByPriority.keys()]);

    return Array.from(priorities)
      .map((priority) => {
        const current = currentByPriority.get(priority);
        const previous = previousByPriority.get(priority);
        const currentCompletionRate = current?.completionRate ?? 0;
        const previousCompletionRate = previous?.completionRate ?? 0;
        return {
          priority,
          currentTotalTasks: current?.totalTasks ?? 0,
          previousTotalTasks: previous?.totalTasks ?? 0,
          currentCompletedTasks: current?.completedTasks ?? 0,
          previousCompletedTasks: previous?.completedTasks ?? 0,
          currentCompletionRate,
          previousCompletionRate,
          completionRateDelta: currentCompletionRate - previousCompletionRate,
        };
      })
      .sort((a, b) => {
        const combinedVolume = b.currentTotalTasks + b.previousTotalTasks;
        const nextVolume = a.currentTotalTasks + a.previousTotalTasks;
        return combinedVolume - nextVolume || a.priority.localeCompare(b.priority);
      });
  }

  /**
   * Get productivity trends
   */
  getProductivityTrends(
    period: 'weekly' | 'monthly' = 'weekly',
    range?: AnalyticsDateRange,
  ): ProductivityTrend[] {
    const dailyStats = range
      ? this.getDailyStatsForRange(range)
      : this.getDailyStats(period === 'weekly' ? 7 : 30);
    const trends: ProductivityTrend[] = [];

    if (period === 'weekly') {
      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const dayStats = new Map<string, DailyStats[]>();

      dailyStats.forEach((stat) => {
        const day = days[stat.date.getDay()];
        if (!dayStats.has(day)) {
          dayStats.set(day, []);
        }
        dayStats.get(day)!.push(stat);
      });

      dayStats.forEach((stats, day) => {
        const avgCompletion = stats.reduce((sum, s) => sum + s.completionRate, 0) / stats.length;
        const totalCompleted = stats.reduce((sum, s) => sum + s.tasksCompleted, 0);
        const avgTime = stats.reduce((sum, s) => sum + s.averageCompletionTime, 0) / stats.length;

        trends.push({
          period: day,
          completionRate: avgCompletion,
          tasksCompleted: totalCompleted,
          averageCompletionTime: avgTime,
          trend: this.calculateTrend(avgCompletion),
        });
      });
    } else {
      const weeks = Math.ceil(dailyStats.length / 7);

      for (let i = 0; i < weeks; i++) {
        const weekStats = dailyStats.slice(i * 7, (i + 1) * 7);
        if (weekStats.length === 0) continue;

        const avgCompletion = weekStats.reduce((sum, s) => sum + s.completionRate, 0) / weekStats.length;
        const totalCompleted = weekStats.reduce((sum, s) => sum + s.tasksCompleted, 0);
        const avgTime = weekStats.reduce((sum, s) => sum + s.averageCompletionTime, 0) / weekStats.length;

        trends.push({
          period: `Week ${i + 1}`,
          completionRate: avgCompletion,
          tasksCompleted: totalCompleted,
          averageCompletionTime: avgTime,
          trend: this.calculateTrend(avgCompletion),
        });
      }
    }

    return trends;
  }

  /**
   * Calculate trend direction
   */
  private calculateTrend(value: number): 'up' | 'down' | 'stable' {
    if (value > 0.7) return 'up';
    if (value < 0.4) return 'down';
    return 'stable';
  }

  /**
   * Get time-based analytics
   */
  getTimeBasedAnalytics(): TimeBasedAnalytics[] {
    return this.timeBasedAnalytics;
  }

  /**
   * Get most productive hour
   */
  getMostProductiveHour(): number {
    let maxHour = 0;
    let maxCompleted = 0;

    this.timeBasedAnalytics.forEach((stat) => {
      if (stat.tasksCompleted > maxCompleted) {
        maxCompleted = stat.tasksCompleted;
        maxHour = stat.hour;
      }
    });

    return maxHour;
  }

  /**
   * Get most productive day
   */
  getMostProductiveDay(range?: AnalyticsDateRange): string {
    const trends = this.getProductivityTrends('weekly', range);
    let maxDay = 'Monday';
    let maxCompleted = 0;

    trends.forEach((trend) => {
      if (trend.tasksCompleted > maxCompleted) {
        maxCompleted = trend.tasksCompleted;
        maxDay = trend.period;
      }
    });

    return maxDay;
  }

  /**
   * Get completion streak
   */
  getCompletionStreak(range?: AnalyticsDateRange): number {
    const dailyStats = (range ? this.getDailyStatsForRange(range) : this.getDailyStats(365))
      .sort((a, b) => b.date.getTime() - a.date.getTime());
    let streak = 0;

    for (const stat of dailyStats) {
      if (stat.completionRate > 0) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  /**
   * Get analytics summary
   */
  getAnalyticsSummary(range?: AnalyticsDateRange): AnalyticsSummary {
    const sourceTasks = range
      ? this.tasks.filter((task) => {
          const createdAt = new Date(task.createdAt).getTime();
          const start = new Date(range.start);
          const end = new Date(range.end);
          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);
          return createdAt >= start.getTime() && createdAt <= end.getTime();
        })
      : this.tasks;
    const scopedService = range ? new AnalyticsDataService(sourceTasks) : this;
    const completed = scopedService.tasks.filter((task) => task.completed).length;
    const pending = scopedService.tasks.filter(
      (task) => !task.completed && new Date(task.dueDate) > new Date(),
    ).length;
    const overdue = scopedService.tasks.filter(
      (task) => !task.completed && new Date(task.dueDate) < new Date(),
    ).length;
    const completionTimes = scopedService.tasks
      .filter((task) => task.completed && task.completedAt)
      .map((task) => new Date(task.completedAt).getTime() - new Date(task.dueDate).getTime());

    const categoryStats = scopedService.getCategoryStats();
    const favoriteCategory = categoryStats.length > 0 ? categoryStats[0].category : 'None';

    return {
      totalTasks: scopedService.tasks.length,
      completedTasks: completed,
      pendingTasks: pending,
      overdueTasks: overdue,
      completionRate: scopedService.tasks.length > 0 ? completed / scopedService.tasks.length : 0,
      averageCompletionTime:
        completionTimes.length > 0
          ? completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length
          : 0,
      mostProductiveDay: scopedService.getMostProductiveDay(),
      mostProductiveHour: scopedService.getMostProductiveHour(),
      favoriteCategory,
      streak: scopedService.getCompletionStreak(),
    };
  }

  /**
   * Export analytics to JSON
   */
  exportToJSON(): string {
    const summary = this.getAnalyticsSummary();
    const dailyStats = this.getDailyStats();
    const categoryStats = this.getCategoryStats();
    const priorityStats = this.getPriorityStats();
    const trends = this.getProductivityTrends('monthly');

    const data = {
      exportDate: new Date().toISOString(),
      summary,
      dailyStats,
      categoryStats,
      priorityStats,
      trends,
    };

    return JSON.stringify(data, null, 2);
  }

  /**
   * Export analytics to CSV
   */
  exportToCSV(): string {
    const dailyStats = this.getDailyStats();
    let csv = 'Date,Tasks Created,Tasks Completed,Tasks Overdue,Completion Rate,Avg Completion Time (ms)\n';

    dailyStats.forEach((stat) => {
      csv += `${stat.date.toISOString().split('T')[0]},${stat.tasksCreated},${stat.tasksCompleted},${stat.tasksOverdue},${(stat.completionRate * 100).toFixed(2)}%,${stat.averageCompletionTime.toFixed(0)}\n`;
    });

    return csv;
  }

  /**
   * Compare the selected inclusive range with the immediately preceding
   * range of the same duration.
   */
  getRangeComparison(
    range: AnalyticsDateRange,
    manualPreviousRange?: AnalyticsDateRange,
  ): AnalyticsRangeComparison {
    const currentStart = new Date(range.start);
    const currentEnd = new Date(range.end);
    const currentRange = { start: currentStart, end: currentEnd };
    const durationMs = currentEnd.getTime() - currentStart.getTime() + 1;
    const previousEnd = new Date(currentStart.getTime() - 1);
    const automaticPreviousStart = new Date(previousEnd.getTime() - durationMs + 1);
    const previousRange = manualPreviousRange
      ? { start: new Date(manualPreviousRange.start), end: new Date(manualPreviousRange.end) }
      : { start: automaticPreviousStart, end: previousEnd };
    const current = this.getAnalyticsSummary(currentRange);
    const previous = this.getAnalyticsSummary(previousRange);

    return {
      currentRange,
      previousRange,
      current,
      previous,
      deltas: {
        totalTasks: current.totalTasks - previous.totalTasks,
        completedTasks: current.completedTasks - previous.completedTasks,
        pendingTasks: current.pendingTasks - previous.pendingTasks,
        overdueTasks: current.overdueTasks - previous.overdueTasks,
        completionRate: current.completionRate - previous.completionRate,
        streak: current.streak - previous.streak,
      },
    };
  }

  /**
   * Get comparison data
   */
  getComparison(period1: 'week' | 'month' = 'week', period2?: 'week' | 'month'): {
    period1: AnalyticsSummary;
    period2: AnalyticsSummary;
    improvement: number;
  } {
    const now = new Date();
    const days1 = period1 === 'week' ? 7 : 30;
    const days2 = period2 === 'week' ? 7 : 30;

    const cutoff1 = new Date(now.getTime() - days1 * 24 * 60 * 60 * 1000);
    const cutoff2 = new Date(now.getTime() - (days1 + days2) * 24 * 60 * 60 * 1000);

    const tasks1 = this.tasks.filter((t) => new Date(t.createdAt) >= cutoff1);
    const tasks2 = this.tasks.filter((t) => new Date(t.createdAt) >= cutoff2 && new Date(t.createdAt) < cutoff1);

    const service1 = new AnalyticsDataService(tasks1);
    const service2 = new AnalyticsDataService(tasks2);

    const summary1 = service1.getAnalyticsSummary();
    const summary2 = service2.getAnalyticsSummary();

    const improvement = ((summary1.completionRate - summary2.completionRate) / summary2.completionRate) * 100;

    return {
      period1: summary1,
      period2: summary2,
      improvement,
    };
  }
}

export const analyticsDataService = new AnalyticsDataService();
export default AnalyticsDataService;
