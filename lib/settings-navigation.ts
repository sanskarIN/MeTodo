export const SETTINGS_ROUTE = "/settings" as const;
export const CHART_ANIMATION_SETTINGS_SECTION = "chart-animation" as const;

export function normalizeSettingsSection(value: unknown): string | undefined {
  if (typeof value === "string") {
    return value;
  }

  if (Array.isArray(value) && typeof value[0] === "string") {
    return value[0];
  }

  return undefined;
}

export function isChartAnimationSettingsSection(value: unknown): boolean {
  return normalizeSettingsSection(value) === CHART_ANIMATION_SETTINGS_SECTION;
}

export function createChartAnimationSettingsTarget() {
  return {
    pathname: SETTINGS_ROUTE,
    params: { section: CHART_ANIMATION_SETTINGS_SECTION },
  } as const;
}
