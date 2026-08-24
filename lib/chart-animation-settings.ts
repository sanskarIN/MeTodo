import type { AppSettings, ChartAnimationSpeed } from '@/types';

export const DEFAULT_CHART_ANIMATION_SETTINGS: Pick<AppSettings, 'chartAnimationSpeed' | 'reduceMotion'> = {
  chartAnimationSpeed: 'normal',
  reduceMotion: false,
};

const VALID_SPEEDS: ChartAnimationSpeed[] = ['slow', 'normal', 'fast'];

export function normalizeChartAnimationSettings(
  settings?: Partial<Pick<AppSettings, 'chartAnimationSpeed' | 'reduceMotion'>> | null,
): Pick<AppSettings, 'chartAnimationSpeed' | 'reduceMotion'> {
  const speed = settings?.chartAnimationSpeed;
  return {
    chartAnimationSpeed: speed && VALID_SPEEDS.includes(speed) ? speed : DEFAULT_CHART_ANIMATION_SETTINGS.chartAnimationSpeed,
    reduceMotion: settings?.reduceMotion === true,
  };
}
