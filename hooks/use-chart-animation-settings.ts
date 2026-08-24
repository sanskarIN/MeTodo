import { useCallback } from 'react';

import { useReducedMotion as useSystemReducedMotion } from '@/hooks/use-reduced-motion';
import { getChartAnimationDuration } from '@/lib/chart-tooltip-metrics';
import { useTaskContext } from '@/lib/task-context';
import type { ChartAnimationSpeed } from '@/types';

export interface ChartAnimationSettings {
  animationSpeed: ChartAnimationSpeed;
  reducedMotion: boolean;
  systemReducedMotion: boolean;
  getDuration: (baseDuration: number) => number;
}

/**
 * Combines the operating-system preference with the user's in-app chart
 * preference. The accessibility preference always wins over speed settings.
 */
export function useChartAnimationSettings(): ChartAnimationSettings {
  const { settings } = useTaskContext();
  const systemReducedMotion = useSystemReducedMotion();
  const animationSpeed = settings.chartAnimationSpeed ?? 'normal';
  const reducedMotion = systemReducedMotion || Boolean(settings.reduceMotion);
  const getDuration = useCallback(
    (baseDuration: number) => getChartAnimationDuration(baseDuration, reducedMotion, animationSpeed),
    [animationSpeed, reducedMotion],
  );

  return {
    animationSpeed,
    reducedMotion,
    systemReducedMotion,
    getDuration,
  };
}
