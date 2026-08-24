// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

/**
 * FILE PURPOSE: Interactive Pie Chart Component
 *
 * Reusable task distribution chart with touch-friendly slice inspection.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, Text, Pressable } from 'react-native';

import { AnimatedTooltip } from '@/components/charts/animated-tooltip';
import { useChartAnimationSettings } from '@/hooks/use-chart-animation-settings';
import { getMetricRank, getMetricShare } from '@/lib/chart-tooltip-metrics';

interface PieChartProps {
  title: string;
  data: {
    label: string;
    value: number;
    color?: string;
  }[];
  showLegend?: boolean;
  showPercentage?: boolean;
}

interface SelectedSlice {
  label: string;
  value: number;
  percentage: number;
  color: string;
  rank: number;
  cumulativePercentage: number;
}

/**
 * Pie Chart Component
 */
export function PieChart({
  title,
  data,
  showLegend = true,
  showPercentage = true,
}: PieChartProps) {
  const [selectedSlice, setSelectedSlice] = useState<SelectedSlice | null>(null);
  const chartProgress = useRef(new Animated.Value(1)).current;
  const { reducedMotion, getDuration } = useChartAnimationSettings();
  const dataSignature = data.map((item) => `${item.label}:${item.value}`).join('|');

  useEffect(() => {
    chartProgress.stopAnimation();
    chartProgress.setValue(0);
    const animation = Animated.timing(chartProgress, {
      toValue: 1,
      duration: getDuration(360),
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [chartProgress, dataSignature, getDuration, reducedMotion]);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const colors = [
    '#3B82F6',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
    '#EC4899',
    '#06B6D4',
    '#14B8A6',
  ];

  let currentAngle = 0;
  let cumulativePercentage = 0;
  const segments = data.map((item, index) => {
    const percentage = getMetricShare(item.value, total);
    const sliceAngle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + sliceAngle;
    currentAngle = endAngle;
    cumulativePercentage += percentage;

    return {
      ...item,
      percentage,
      startAngle,
      endAngle,
      cumulativePercentage,
      color: item.color || colors[index % colors.length],
    };
  });

  return (
    <View className="bg-surface rounded-lg p-4 mb-4 border border-border">
      <Text className="text-lg font-bold text-foreground mb-4">{title}</Text>

      <AnimatedTooltip
        visible={Boolean(selectedSlice)}
        contentKey={selectedSlice ? `${selectedSlice.label}:${selectedSlice.value}` : 'empty'}
      >
        {selectedSlice && (
          <>
            <View className="flex-row items-center gap-2">
              <View className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedSlice.color }} />
              <Text className="text-sm font-bold text-foreground">{selectedSlice.label}</Text>
            </View>
            <View className="flex-row justify-between items-center mt-2">
              <Text className="text-xs text-muted">Tasks</Text>
              <Text className="text-sm font-semibold text-foreground">{selectedSlice.value}</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-xs text-muted">Share of total</Text>
              <Text className="text-sm font-semibold text-foreground">{selectedSlice.percentage.toFixed(1)}%</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-xs text-muted">Rank</Text>
              <Text className="text-sm font-semibold text-foreground">#{selectedSlice.rank} of {segments.length}</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-xs text-muted">Cumulative share</Text>
              <Text className="text-sm font-semibold text-foreground">{selectedSlice.cumulativePercentage.toFixed(1)}%</Text>
            </View>
            <Text className="text-[10px] text-muted mt-1">Total tasks in chart: {total}</Text>
          </>
        )}
      </AnimatedTooltip>

      {/* Pie Chart Visualization */}
      <View className="items-center mb-4">
          <Animated.View
            className="w-40 h-40 rounded-full bg-gray-200 items-center justify-center"
            style={{
              opacity: chartProgress,
              transform: [
                {
                  scale: chartProgress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.88, 1],
                  }),
                },
              ],
            }}
          >
            {total === 0 ? (
            <Text className="text-xs text-muted">No data</Text>
          ) : (
            <View className="flex-row flex-wrap justify-center items-center w-full h-full">
              {segments.map((segment, index) => {
                const isSelected = selectedSlice?.label === segment.label;
                return (
                  <Pressable
                    key={`${segment.label}-${index}`}
                    accessibilityRole="button"
                    accessibilityLabel={`Show details for ${segment.label}`}
                    onPress={() => setSelectedSlice({
                      ...segment,
                      rank: getMetricRank(segment.value, data.map((entry) => entry.value)),
                    })}
                    style={({ pressed }) => [
                      {
                        width: `${segment.percentage}%`,
                        height: '100%',
                        backgroundColor: segment.color,
                        opacity: isSelected ? 1 : 0.8,
                        alignItems: 'center',
                        justifyContent: 'center',
                      },
                      pressed && { opacity: 0.6 },
                    ]}
                  >
                    {segment.percentage > 10 && (
                      <Text className="text-xs font-bold text-white">
                        {segment.percentage.toFixed(0)}%
                      </Text>
                    )}
                  </Pressable>
                );
              })}
            </View>
          )}
          </Animated.View>
        </View>

      {/* Legend */}
      {showLegend && (
        <View className="gap-2">
          {segments.map((segment, index) => {
            const isSelected = selectedSlice?.label === segment.label;
            return (
              <Pressable
                key={`legend-${segment.label}-${index}`}
                accessibilityRole="button"
                accessibilityLabel={`Show details for ${segment.label}`}
                onPress={() => setSelectedSlice({
                  ...segment,
                  rank: getMetricRank(segment.value, data.map((entry) => entry.value)),
                })}
                style={({ pressed }) => [
                  { flexDirection: 'row', alignItems: 'center', gap: 12, opacity: isSelected ? 1 : 0.9 },
                  pressed && { opacity: 0.6 },
                ]}
              >
                <View className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }} />
                <Text className="text-sm text-foreground flex-1">{segment.label}</Text>
                <View className="flex-row items-center gap-1">
                  <Text className="text-sm font-semibold text-foreground">{segment.value}</Text>
                  {showPercentage && (
                    <Text className="text-xs text-muted">({segment.percentage.toFixed(1)}%)</Text>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

export default PieChart;
