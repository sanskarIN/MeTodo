import type { AnalyticsDateRange, PriorityComparison } from '@/lib/analytics-data-service';
import { getMetricShare } from '@/lib/chart-tooltip-metrics';

export interface PriorityComparisonExportRanges {
  currentRange: AnalyticsDateRange;
  previousRange: AnalyticsDateRange;
}

const CSV_HEADERS = [
  'current_range_start',
  'current_range_end',
  'previous_range_start',
  'previous_range_end',
  'priority',
  'current_total_tasks',
  'current_completed_tasks',
  'current_completion_rate_percent',
  'current_completed_share_percent',
  'previous_total_tasks',
  'previous_completed_tasks',
  'previous_completion_rate_percent',
  'previous_completed_share_percent',
  'completed_task_delta',
  'completion_rate_delta_percentage_points',
] as const;

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function escapeCsv(value: string | number): string {
  const text = String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function formatPercent(value: number): number {
  return Number((value * 100).toFixed(2));
}

export function serializePriorityComparisonToCSV(
  data: PriorityComparison[],
  ranges: PriorityComparisonExportRanges,
): string {
  const currentRangeStart = formatDate(ranges.currentRange.start);
  const currentRangeEnd = formatDate(ranges.currentRange.end);
  const previousRangeStart = formatDate(ranges.previousRange.start);
  const previousRangeEnd = formatDate(ranges.previousRange.end);
  const currentCompletedTotal = data.reduce((sum, item) => sum + item.currentCompletedTasks, 0);
  const previousCompletedTotal = data.reduce((sum, item) => sum + item.previousCompletedTasks, 0);

  const rows = data.length > 0
    ? data.map((item) => [
        currentRangeStart,
        currentRangeEnd,
        previousRangeStart,
        previousRangeEnd,
        item.priority,
        item.currentTotalTasks,
        item.currentCompletedTasks,
        formatPercent(item.currentCompletionRate),
        Number(getMetricShare(item.currentCompletedTasks, currentCompletedTotal).toFixed(2)),
        item.previousTotalTasks,
        item.previousCompletedTasks,
        formatPercent(item.previousCompletionRate),
        Number(getMetricShare(item.previousCompletedTasks, previousCompletedTotal).toFixed(2)),
        item.currentCompletedTasks - item.previousCompletedTasks,
        Number((item.completionRateDelta * 100).toFixed(2)),
      ] as Array<string | number>)
    : [[
        currentRangeStart,
        currentRangeEnd,
        previousRangeStart,
        previousRangeEnd,
        'No data',
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
      ] as Array<string | number>];

  return [
    CSV_HEADERS.map(escapeCsv).join(','),
    ...rows.map((row) => row.map(escapeCsv).join(',')),
  ].join('\r\n') + '\r\n';
}

export function createPriorityComparisonFilename(ranges: PriorityComparisonExportRanges): string {
  return `metodo-priority-comparison-${formatDate(ranges.currentRange.start)}-to-${formatDate(ranges.currentRange.end)}.csv`;
}
