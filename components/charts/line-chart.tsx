// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

/**
 * FILE PURPOSE: Interactive Line Chart Component
 *
 * Reusable productivity trend chart with touch-friendly point inspection.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, Text, ScrollView, Dimensions, Pressable } from 'react-native';

import { AnimatedTooltip } from '@/components/charts/animated-tooltip';
import { useChartAnimationSettings } from '@/hooks/use-chart-animation-settings';
import { formatSignedMetric, getPointTooltipMetrics } from '@/lib/chart-tooltip-metrics';

interface LineChartProps {
  title: string;
  data: {
    labels: string[];
    datasets: {
      data: number[];
      color?: string;
      strokeWidth?: number;
    }[];
  };
  height?: number;
  showLegend?: boolean;
  showGrid?: boolean;
  yAxisLabel?: string;
  yAxisSuffix?: string;
}

interface SelectedPoint {
  label: string;
  values: number[];
  changes: number[];
  average: number;
  minimum: number;
  maximum: number;
}

/**
 * Line Chart Component
 *
 * The chart is rendered as touchable columns. Pressing a column reveals a
 * tooltip with the selected label and every dataset value for that point.
 */
export function LineChart({
  title,
  data,
  height = 220,
  showLegend = true,
  showGrid = true,
  yAxisLabel = '',
  yAxisSuffix = '',
}: LineChartProps) {
  const [selectedPoint, setSelectedPoint] = useState<SelectedPoint | null>(null);
  const chartProgress = useRef(new Animated.Value(1)).current;
  const { reducedMotion, getDuration } = useChartAnimationSettings();
  const dataSignature = `${data.labels.join('|')}::${data.datasets
    .map((dataset) => dataset.data.join(','))
    .join('|')}`;

  useEffect(() => {
    chartProgress.stopAnimation();
    chartProgress.setValue(0);
    const animation = Animated.timing(chartProgress, {
      toValue: 1,
      duration: getDuration(280),
      useNativeDriver: false,
    });
    animation.start();
    return () => animation.stop();
  }, [chartProgress, dataSignature, getDuration, reducedMotion]);

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 32;
  const allValues = data.datasets.flatMap((dataset) => dataset.data);
  const maxValue = Math.max(...allValues, 1);
  const minValue = Math.min(...allValues, 0);
  const range = maxValue - minValue || 1;

  return (
    <View className="bg-surface rounded-lg p-4 mb-4 border border-border">
      <Text className="text-lg font-bold text-foreground mb-4">{title}</Text>

      <AnimatedTooltip
        visible={Boolean(selectedPoint)}
        contentKey={selectedPoint ? `${selectedPoint.label}:${selectedPoint.values.join(',')}` : 'empty'}
      >
        {selectedPoint && (
          <>
            <Text className="text-sm font-bold text-foreground mb-2">{selectedPoint.label}</Text>
            {selectedPoint.values.map((value, index) => (
              <View key={`tooltip-series-${index}`} className="flex-row justify-between items-center">
                <Text className="text-xs text-muted">
                  {yAxisLabel || `Series ${index + 1}`}
                </Text>
                <View className="flex-row items-center gap-2">
                  <Text className="text-sm font-semibold text-foreground">
                    {value.toFixed(1)}{yAxisSuffix}
                  </Text>
                  <Text className={`text-xs ${selectedPoint.changes[index] >= 0 ? 'text-success' : 'text-error'}`}>
                    {formatSignedMetric(selectedPoint.changes[index])}
                  </Text>
                </View>
              </View>
            ))}
            <View className="border-t border-border mt-2 pt-2 gap-1">
              <View className="flex-row justify-between">
                <Text className="text-xs text-muted">Point average</Text>
                <Text className="text-xs font-semibold text-foreground">{selectedPoint.average.toFixed(1)}{yAxisSuffix}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-xs text-muted">Point range</Text>
                <Text className="text-xs font-semibold text-foreground">
                  {selectedPoint.minimum.toFixed(1)}–{selectedPoint.maximum.toFixed(1)}{yAxisSuffix}
                </Text>
              </View>
              <Text className="text-[10px] text-muted">Change values compare with the preceding data point.</Text>
            </View>
          </>
        )}
      </AnimatedTooltip>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View
          className="flex-row items-end gap-2"
          style={{ height, minWidth: Math.max(chartWidth, data.labels.length * 44) }}
        >
          {data.labels.map((label, index) => {
            const values = data.datasets.map((dataset) => dataset.data[index] || 0);
            const maxDataPoint = Math.max(...values, 0);
            const barHeight = ((maxDataPoint - minValue) / range) * (height - 40);

            return (
              <Pressable
                key={`${label}-${index}`}
                accessibilityRole="button"
                accessibilityLabel={`Show values for ${label}`}
                onPress={() => {
                  const previousValues = index > 0
                    ? data.datasets.map((dataset) => dataset.data[index - 1] || 0)
                    : values;
                  setSelectedPoint({
                    label,
                    values,
                    ...getPointTooltipMetrics(values, previousValues),
                  });
                }}
                style={({ pressed }) => [
                  { alignItems: 'center', gap: 4, width: 38 },
                  pressed && { opacity: 0.65, transform: [{ scale: 0.97 }] },
                ]}
              >
                <Animated.View
                  className="rounded-t-lg bg-primary"
                  style={{
                    width: 30,
                    height: chartProgress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [5, Math.max(barHeight, 5)],
                    }),
                    opacity: selectedPoint?.label === label ? 1 : 0.8,
                  }}
                />
                <Text className="text-xs text-muted text-center w-12">{label}</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {showLegend && (
        <View className="flex-row flex-wrap gap-2 mt-4">
          {data.datasets.map((dataset, index) => (
            <View key={`legend-${index}`} className="flex-row items-center gap-2">
              <View
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: dataset.color || '#3B82F6' }}
              />
              <Text className="text-sm text-muted">Series {index + 1}</Text>
            </View>
          ))}
        </View>
      )}

      {!showGrid && null}
    </View>
  );
}

export default LineChart;
