import { describe, it, expect } from 'vitest';
import SearchUtil, { type SearchableTask } from '../lib/search-utils';
import type { Task } from '../types';
import { THEME_PRESETS } from '../lib/themes-preset';
import AnalyticsDataService from '../lib/analytics-data-service';
import { normalizeChartAnimationSettings } from '../lib/chart-animation-settings';
import {
  createPriorityComparisonFilename,
  serializePriorityComparisonToCSV,
} from '../lib/priority-comparison-export';
import {
  createChartAnimationSettingsTarget,
  isChartAnimationSettingsSection,
} from '../lib/settings-navigation';
import {
  createTaskCalendarEventData,
  findWritableCalendarOption,
  getTaskCalendarBulkEligibility,
  hasTaskCalendarLink,
} from '../lib/task-calendar-utils';
import { normalizeCalendarSelectionSettings } from '../lib/calendar-selection-settings';
import {
  formatSignedMetric,
  getAnimationSpeedMultiplier,
  getChartAnimationDuration,
  getMetricRank,
  getMetricShare,
  getNormalizedMetric,
  getPointTooltipMetrics,
} from '../lib/chart-tooltip-metrics';

describe('MeTodo Comprehensive Unit Tests', () => {
  it('should verify search and filter utilities correctly', () => {
    const now = new Date();
    const mockTasks: SearchableTask[] = [
      {
        id: '1',
        title: 'Complete report',
        description: 'Prepare the quarterly report',
        priority: 'high',
        category: 'work',
        tags: ['report'],
        status: 'pending',
        dueDate: now,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: '2',
        title: 'Buy groceries',
        description: 'Purchase groceries for the week',
        priority: 'low',
        category: 'personal',
        tags: ['errands'],
        status: 'completed',
        dueDate: now,
        createdAt: now,
        updatedAt: now,
      },
    ];

    const filtered = SearchUtil.filter(mockTasks, { priority: ['high'] });
    expect(filtered.length).toBe(1);
    expect(filtered[0].title).toBe('Complete report');
  });

  it('should verify theme presets are loaded correctly', () => {
    expect(THEME_PRESETS.length).toBeGreaterThan(40);
    const defaultLight = THEME_PRESETS.find(p => p.id === 'default-light');
    expect(defaultLight).toBeDefined();
    expect(defaultLight?.colors.primary.light).toBe('#0a7ea4');
  });

  it('should compare against a manually selected previous range', () => {
    const previousDate = new Date('2025-02-05T12:00:00.000Z');
    const currentDate = new Date('2025-03-20T12:00:00.000Z');
    const service = new AnalyticsDataService([
      {
        id: 'manual-previous',
        title: 'Manual previous task',
        category: 'work',
        priority: 'low',
        completed: true,
        completedAt: previousDate,
        dueDate: previousDate,
        createdAt: previousDate,
        updatedAt: previousDate,
      },
      {
        id: 'manual-current',
        title: 'Manual current task',
        category: 'work',
        priority: 'high',
        completed: false,
        dueDate: currentDate,
        createdAt: currentDate,
        updatedAt: currentDate,
      },
    ]);
    const comparison = service.getRangeComparison(
      {
        start: new Date('2025-03-01T00:00:00.000Z'),
        end: new Date('2025-03-31T23:59:59.999Z'),
      },
      {
        start: new Date('2025-02-01T00:00:00.000Z'),
        end: new Date('2025-02-15T23:59:59.999Z'),
      },
    );

    expect(comparison.previousRange.start.toISOString()).toBe('2025-02-01T00:00:00.000Z');
    expect(comparison.previousRange.end.toISOString()).toBe('2025-02-15T23:59:59.999Z');
    expect(comparison.previous.completedTasks).toBe(1);
    expect(comparison.current.completedTasks).toBe(0);
    expect(comparison.deltas.completedTasks).toBe(-1);
  });

  it('should compare the current range with the immediately preceding range', () => {
    const previousTaskDate = new Date('2025-01-05T12:00:00.000Z');
    const currentTaskDate = new Date('2025-01-15T12:00:00.000Z');
    const service = new AnalyticsDataService([
      {
        id: 'previous',
        title: 'Previous task',
        category: 'work',
        priority: 'low',
        completed: false,
        dueDate: previousTaskDate,
        createdAt: previousTaskDate,
        updatedAt: previousTaskDate,
      },
      {
        id: 'current',
        title: 'Current task',
        category: 'work',
        priority: 'high',
        completed: true,
        completedAt: currentTaskDate,
        dueDate: currentTaskDate,
        createdAt: currentTaskDate,
        updatedAt: currentTaskDate,
      },
    ]);
    const comparison = service.getRangeComparison({
      start: new Date('2025-01-10T00:00:00.000Z'),
      end: new Date('2025-01-19T23:59:59.999Z'),
    });

    expect(comparison.current.totalTasks).toBe(1);
    expect(comparison.previous.totalTasks).toBe(1);
    expect(comparison.deltas.completedTasks).toBe(1);
  });

  it('should scope analytics to an inclusive custom date range', () => {
    const insideDate = new Date('2025-01-05T12:00:00.000Z');
    const outsideDate = new Date('2025-01-20T12:00:00.000Z');
    const tasks = [
      {
        id: 'inside',
        title: 'Inside range',
        category: 'work',
        priority: 'high',
        completed: true,
        completedAt: insideDate,
        dueDate: insideDate,
        createdAt: insideDate,
        updatedAt: insideDate,
      },
      {
        id: 'outside',
        title: 'Outside range',
        category: 'personal',
        priority: 'low',
        completed: false,
        dueDate: outsideDate,
        createdAt: outsideDate,
        updatedAt: outsideDate,
      },
    ];
    const service = new AnalyticsDataService(tasks);
    const range = {
      start: new Date('2025-01-01T00:00:00.000Z'),
      end: new Date('2025-01-10T23:59:59.999Z'),
    };

    expect(service.getDailyStatsForRange(range)).toHaveLength(1);
    expect(service.getAnalyticsSummary(range).totalTasks).toBe(1);
    expect(service.getAnalyticsSummary(range).completedTasks).toBe(1);
  });
});


describe('Category comparison analytics', () => {
  it('returns the union of categories and compares inclusive reporting windows', () => {
    const currentBoundary = new Date('2025-04-01T00:00:00.000Z');
    const previousBoundary = new Date('2025-03-31T23:59:59.999Z');
    const service = new AnalyticsDataService([
      {
        id: 'current-work',
        title: 'Current work',
        category: 'work',
        completed: true,
        completedAt: currentBoundary,
        dueDate: currentBoundary,
        createdAt: currentBoundary,
      },
      {
        id: 'current-personal',
        title: 'Current personal',
        category: 'personal',
        completed: false,
        dueDate: currentBoundary,
        createdAt: currentBoundary,
      },
      {
        id: 'previous-work',
        title: 'Previous work',
        category: 'work',
        completed: false,
        dueDate: previousBoundary,
        createdAt: previousBoundary,
      },
      {
        id: 'previous-health',
        title: 'Previous health',
        category: 'health',
        completed: true,
        completedAt: previousBoundary,
        dueDate: previousBoundary,
        createdAt: previousBoundary,
      },
    ]);

    const comparison = service.getCategoryComparison(
      {
        start: new Date('2025-04-01T00:00:00.000Z'),
        end: new Date('2025-04-01T23:59:59.999Z'),
      },
      {
        start: new Date('2025-03-31T00:00:00.000Z'),
        end: new Date('2025-03-31T23:59:59.999Z'),
      },
    );

    expect(comparison.map((item) => item.category)).toEqual(['work', 'health', 'personal']);
    expect(comparison.find((item) => item.category === 'work')).toMatchObject({
      currentTotalTasks: 1,
      previousTotalTasks: 1,
      currentCompletedTasks: 1,
      previousCompletedTasks: 0,
      currentCompletionRate: 1,
      previousCompletionRate: 0,
      completionRateDelta: 1,
    });
    expect(comparison.find((item) => item.category === 'personal')).toMatchObject({
      currentTotalTasks: 1,
      previousTotalTasks: 0,
      currentCompletedTasks: 0,
      previousCompletedTasks: 0,
    });
    expect(comparison.find((item) => item.category === 'health')).toMatchObject({
      currentTotalTasks: 0,
      previousTotalTasks: 1,
      currentCompletedTasks: 0,
      previousCompletedTasks: 1,
    });
  });
});


describe('Chart tooltip metrics', () => {
  it('calculates detailed point metrics and signed changes', () => {
    expect(getPointTooltipMetrics([12, 6], [10, 8])).toEqual({
      changes: [2, -2],
      average: 9,
      minimum: 0,
      maximum: 12,
    });
    expect(formatSignedMetric(2)).toBe('+2.0');
    expect(formatSignedMetric(-2)).toBe('-2.0');
  });

  it('calculates safe shares and competition ranks', () => {
    expect(getMetricShare(25, 100)).toBe(25);
    expect(getMetricShare(1, 0)).toBe(0);
    expect(getMetricRank(8, [10, 8, 6])).toBe(2);
    expect(getMetricRank(10, [10, 10, 6])).toBe(1);
  });

  it('disables chart motion when reduced motion is enabled', () => {
    expect(getChartAnimationDuration(320, true)).toBe(0);
    expect(getChartAnimationDuration(320, false)).toBe(320);
  });

  it('applies chart animation speed multipliers deterministically', () => {
    expect(getAnimationSpeedMultiplier('slow')).toBe(1.5);
    expect(getChartAnimationDuration(320, false, 'slow')).toBe(480);
    expect(getChartAnimationDuration(320, false, 'fast')).toBe(192);
    expect(getChartAnimationDuration(320, true, 'slow')).toBe(0);
  });

  it('normalizes legacy and invalid persisted chart motion settings', () => {
    expect(normalizeChartAnimationSettings({ chartAnimationSpeed: 'fast', reduceMotion: true })).toEqual({
      chartAnimationSpeed: 'fast',
      reduceMotion: true,
    });
    expect(normalizeChartAnimationSettings({ chartAnimationSpeed: 'invalid' as never, reduceMotion: 'yes' as never })).toEqual({
      chartAnimationSpeed: 'normal',
      reduceMotion: false,
    });
  });
});


describe('Priority comparison analytics', () => {
  it('compares current and previous priority performance across inclusive ranges', () => {
    const currentDate = new Date('2025-05-01T12:00:00.000Z');
    const previousDate = new Date('2025-04-30T12:00:00.000Z');
    const service = new AnalyticsDataService([
      {
        id: 'current-high',
        title: 'Current high priority',
        priority: 'high',
        completed: true,
        completedAt: currentDate,
        dueDate: currentDate,
        createdAt: currentDate,
      },
      {
        id: 'current-medium',
        title: 'Current medium priority',
        priority: 'medium',
        completed: false,
        dueDate: currentDate,
        createdAt: currentDate,
      },
      {
        id: 'previous-high',
        title: 'Previous high priority',
        priority: 'high',
        completed: false,
        dueDate: previousDate,
        createdAt: previousDate,
      },
      {
        id: 'previous-low',
        title: 'Previous low priority',
        priority: 'low',
        completed: true,
        completedAt: previousDate,
        dueDate: previousDate,
        createdAt: previousDate,
      },
    ]);

    const comparison = service.getPriorityComparison(
      {
        start: new Date('2025-05-01T00:00:00.000Z'),
        end: new Date('2025-05-01T23:59:59.999Z'),
      },
      {
        start: new Date('2025-04-30T00:00:00.000Z'),
        end: new Date('2025-04-30T23:59:59.999Z'),
      },
    );

    expect(comparison.map((item) => item.priority)).toEqual(['high', 'low', 'medium']);
    expect(comparison.find((item) => item.priority === 'high')).toMatchObject({
      currentTotalTasks: 1,
      previousTotalTasks: 1,
      currentCompletedTasks: 1,
      previousCompletedTasks: 0,
      currentCompletionRate: 1,
      previousCompletionRate: 0,
      completionRateDelta: 1,
    });
    expect(comparison.find((item) => item.priority === 'medium')).toMatchObject({
      currentTotalTasks: 1,
      previousTotalTasks: 0,
      currentCompletedTasks: 0,
      previousCompletedTasks: 0,
    });
    expect(comparison.find((item) => item.priority === 'low')).toMatchObject({
      currentTotalTasks: 0,
      previousTotalTasks: 1,
      currentCompletedTasks: 0,
      previousCompletedTasks: 1,
    });
  });
});


describe('Priority radar visualization metrics', () => {
  it('normalizes completed-task values to a safe radar range', () => {
    expect(getNormalizedMetric(5, 10)).toBe(0.5);
    expect(getNormalizedMetric(20, 10)).toBe(1);
    expect(getNormalizedMetric(-2, 10)).toBe(0);
    expect(getNormalizedMetric(5, 0)).toBe(0);
  });
});


describe('Priority comparison CSV export', () => {
  const ranges = {
    currentRange: { start: new Date(2026, 0, 1), end: new Date(2026, 0, 7) },
    previousRange: { start: new Date(2025, 11, 25), end: new Date(2025, 11, 31) },
  };

  it('serializes comparison rows with range metadata, shares, and escaped priorities', () => {
    const csv = serializePriorityComparisonToCSV([
      {
        priority: 'High, urgent',
        currentTotalTasks: 10,
        previousTotalTasks: 8,
        currentCompletedTasks: 6,
        previousCompletedTasks: 4,
        currentCompletionRate: 0.6,
        previousCompletionRate: 0.5,
        completionRateDelta: 0.1,
      },
    ], ranges);

    expect(csv.split('\r\n')[0]).toContain('current_range_start');
    expect(csv).toContain('2026-01-01,2026-01-07,2025-12-25,2025-12-31');
    expect(csv).toContain('"High, urgent"');
    expect(csv).toContain('"High, urgent",10,6,60,100,8,4,50,100,2,10');
    expect(createPriorityComparisonFilename(ranges)).toBe('metodo-priority-comparison-2026-01-01-to-2026-01-07.csv');
  });

  it('produces a deterministic no-data row for empty comparison ranges', () => {
    const csv = serializePriorityComparisonToCSV([], ranges);
    expect(csv).toContain('No data');
    expect(csv.endsWith('\r\n')).toBe(true);
  });
});


describe('Settings navigation quick action', () => {
  it('creates and recognizes the chart animation settings target', () => {
    expect(createChartAnimationSettingsTarget()).toEqual({
      pathname: '/settings',
      params: { section: 'chart-animation' },
    });
    expect(isChartAnimationSettingsSection('chart-animation')).toBe(true);
    expect(isChartAnimationSettingsSection(['chart-animation'])).toBe(true);
    expect(isChartAnimationSettingsSection('themes')).toBe(false);
    expect(isChartAnimationSettingsSection(['themes'])).toBe(false);
    expect(isChartAnimationSettingsSection([])).toBe(false);
  });
});


describe('Live chart animation preview timing', () => {
  it('maps preview transitions to the selected speed without bypassing reduced motion', () => {
    expect(getChartAnimationDuration(520, false, 'slow')).toBe(780);
    expect(getChartAnimationDuration(520, false, 'normal')).toBe(520);
    expect(getChartAnimationDuration(520, false, 'fast')).toBe(312);
    expect(getChartAnimationDuration(520, true, 'fast')).toBe(0);
  });
});
describe('Device calendar task mapping', () => {
  const dueDate = new Date(2026, 6, 14, 0, 0, 0, 0);

  it('creates a deterministic linked-calendar payload for a dated task', () => {
    const event = createTaskCalendarEventData({
      id: 'calendar-task',
      title: 'Prepare launch plan',
      description: 'Finalize the cross-platform rollout checklist.',
      dueDate,
      priority: 'high',
      category: 'work',
    });

    expect(event).not.toBeNull();
    expect(event?.title).toBe('Prepare launch plan');
    expect(event?.startDate.getHours()).toBe(9);
    expect(event?.endDate.getTime()).toBe(event!.startDate.getTime() + 60 * 60 * 1000);
    expect(event?.notes).toContain('Task ID: calendar-task');
    expect(event?.notes).toContain('Priority: high');
    expect(event?.alarms).toEqual([{ relativeOffset: -30 }]);
  });

  it('refuses calendar payloads without a usable due date and detects persisted links', () => {
    expect(createTaskCalendarEventData({
      id: 'undated-task',
      title: 'Undated',
      description: '',
      dueDate: undefined,
      priority: 'low',
      category: 'personal',
    })).toBeNull();
    expect(hasTaskCalendarLink({ calendarEvent: undefined })).toBe(false);
    expect(hasTaskCalendarLink({
      calendarEvent: {
        eventId: 'event-1',
        calendarId: 'calendar-1',
        linkedAt: dueDate,
        lastSyncedAt: dueDate,
      },
    })).toBe(true);
  });

  it('finds only an explicitly preferred writable calendar and normalizes stored preference values', () => {
    const calendars = [
      { id: 'work', title: 'Work', color: '#0088cc' },
      { id: 'personal', title: 'Personal', color: '#cc0088' },
    ];

    expect(findWritableCalendarOption(calendars, 'personal')).toEqual(calendars[1]);
    expect(findWritableCalendarOption(calendars, 'missing')).toBeNull();
    expect(findWritableCalendarOption(calendars, null)).toBeNull();
    expect(normalizeCalendarSelectionSettings({ preferredCalendarId: 'work', preferredCalendarTitle: 'Work' }))
      .toEqual({ preferredCalendarId: 'work', preferredCalendarTitle: 'Work' });
    expect(normalizeCalendarSelectionSettings({ preferredCalendarId: 123, preferredCalendarTitle: [] }))
      .toEqual({ preferredCalendarId: null, preferredCalendarTitle: null });
  });

  it('identifies only unlinked tasks with valid due dates as eligible for bulk calendar linking', () => {
    const eligibility = getTaskCalendarBulkEligibility([
      {
        id: 'eligible',
        title: 'Eligible task',
        description: '',
        dueDate,
        priority: 'medium',
        category: 'work',
      },
      {
        id: 'already-linked',
        title: 'Linked task',
        description: '',
        dueDate,
        priority: 'high',
        category: 'work',
        calendarEvent: { eventId: 'event-2', calendarId: 'calendar-2', linkedAt: dueDate, lastSyncedAt: dueDate },
      },
      {
        id: 'no-date',
        title: 'Undated task',
        description: '',
        priority: 'low',
        category: 'personal',
      },
      {
        id: 'bad-date',
        title: 'Malformed date task',
        description: '',
        dueDate: new Date('not-a-date'),
        priority: 'low',
        category: 'personal',
      },
    ] as Task[]);

    expect(eligibility.eligibleTasks.map((task) => task.id)).toEqual(['eligible']);
    expect(eligibility.ineligibleTasks.map((task) => task.reason)).toEqual(['already_linked', 'missing_due_date', 'invalid_due_date']);
  });
});
