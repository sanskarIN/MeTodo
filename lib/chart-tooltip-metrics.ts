import type { ChartAnimationSpeed } from '@/types';

export interface PointTooltipMetrics {
  changes: number[];
  average: number;
  minimum: number;
  maximum: number;
}

export function getPointTooltipMetrics(values: number[], previousValues = values): PointTooltipMetrics {
  return {
    changes: values.map((value, index) => value - (previousValues[index] ?? 0)),
    average: values.length > 0 ? values.reduce((sum, value) => sum + value, 0) / values.length : 0,
    minimum: Math.min(...values, 0),
    maximum: Math.max(...values, 0),
  };
}

export function getMetricShare(value: number, total: number): number {
  return total > 0 ? (value / total) * 100 : 0;
}

export function getMetricRank(value: number, values: number[]): number {
  return values.filter((candidate) => candidate > value).length + 1;
}

export function getNormalizedMetric(value: number, maximum: number): number {
  if (maximum <= 0) return 0;
  return Math.min(Math.max(value / maximum, 0), 1);
}

export function formatSignedMetric(value: number, decimals = 1): string {
  return `${value > 0 ? '+' : ''}${value.toFixed(decimals)}`;
}

const ANIMATION_SPEED_MULTIPLIERS: Record<ChartAnimationSpeed, number> = {
  slow: 1.5,
  normal: 1,
  fast: 0.6,
};

export function getAnimationSpeedMultiplier(speed: ChartAnimationSpeed = 'normal'): number {
  return ANIMATION_SPEED_MULTIPLIERS[speed] ?? ANIMATION_SPEED_MULTIPLIERS.normal;
}

export function getChartAnimationDuration(
  baseDuration: number,
  reducedMotion: boolean,
  speed: ChartAnimationSpeed = 'normal',
): number {
  return reducedMotion ? 0 : Math.round(baseDuration * getAnimationSpeedMultiplier(speed));
}
