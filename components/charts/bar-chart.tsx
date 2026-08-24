// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

/**
 * FILE PURPOSE: Interactive Bar Chart Component
 *
 * Reusable category and priority chart with touch-friendly value inspection.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Animated, View, Text, ScrollView, Dimensions, Pressable } from 'react-native';

import { AnimatedTooltip } from '@/components/charts/animated-tooltip';
import { useChartAnimationSettings } from '@/hooks/use-chart-animation-settings';
import { getMetricRank, getMetricShare } from '@/lib/chart-tooltip-metrics';

interface BarChartProps {
  title: string;
  data: {
    label: string;
    value: number;
    color?: string;
  }[];
  maxValue?: number;
  showValues?: boolean;
  horizontal?: boolean;
}

interface SelectedBar {
  label: string;
  value: number;
  percentage: number;
  share: number;
  rank: number;
}

/**
 * Bar Chart Component
 */
export function BarChart({
  title,
  data,
  maxValue,
  showValues = true,
  horizontal = false,
}: BarChartProps) {
  const [selectedBar, setSelectedBar] = useState<SelectedBar | null>(null);
  const chartProgress = useRef(new Animated.Value(1)).current;
  const { reducedMotion, getDuration } = useChartAnimationSettings();
  const dataSignature = `${horizontal ? 'horizontal' : 'vertical'}::${data
    .map((item) => `${item.label}:${item.value}`)
    .join('|')}`;

  useEffect(() => {
    chartProgress.stopAnimation();
    chartProgress.setValue(0);
    const animation = Animated.timing(chartProgress, {
      toValue: 1,
      duration: getDuration(320),
      useNativeDriver: false,
    });
    animation.start();
    return () => animation.stop();
  }, [chartProgress, dataSignature, getDuration, reducedMotion]);

  const max = maxValue || Math.max(...data.map((item) => item.value), 1);
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const values = data.map((item) => item.value);
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 32;

  return (
    <View className="bg-surface rounded-lg p-4 mb-4 border border-border">
      <Text className="text-lg font-bold text-foreground mb-4">{title}</Text>

      <AnimatedTooltip
        visible={Boolean(selectedBar)}
        contentKey={selectedBar ? `${selectedBar.label}:${selectedBar.value}` : 'empty'}
      >
        {selectedBar && (
          <>
            <Text className="text-sm font-bold text-foreground">{selectedBar.label}</Text>
            <View className="flex-row justify-between items-center mt-2">
              <Text className="text-xs text-muted">Value</Text>
              <Text className="text-sm font-semibold text-foreground">{selectedBar.value}</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-xs text-muted">Share of all values</Text>
              <Text className="text-sm font-semibold text-foreground">{selectedBar.share.toFixed(1)}%</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-xs text-muted">Share of chart maximum</Text>
              <Text className="text-sm font-semibold text-foreground">{selectedBar.percentage.toFixed(1)}%</Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-xs text-muted">Rank</Text>
              <Text className="text-sm font-semibold text-foreground">#{selectedBar.rank} of {data.length}</Text>
            </View>
          </>
        )}
      </AnimatedTooltip>

      {horizontal ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row gap-4" style={{ minWidth: Math.max(chartWidth, data.length * 64) }}>
            {data.map((item, index) => {
              const percentage = (item.value / max) * 100;
              const isSelected = selectedBar?.label === item.label;
              return (
                <Pressable
                  key={`${item.label}-${index}`}
                  accessibilityRole="button"
                  accessibilityLabel={`Show details for ${item.label}`}
                  onPress={() => setSelectedBar({
                    label: item.label,
                    value: item.value,
                    percentage,
                    share: getMetricShare(item.value, total),
                    rank: getMetricRank(item.value, values),
                  })}
                  style={({ pressed }) => [
                    { alignItems: 'center', gap: 8 },
                    pressed && { opacity: 0.65, transform: [{ scale: 0.97 }] },
                  ]}
                >
                  <Animated.View
                    className="rounded-lg"
                    style={{
                      width: 40,
                      height: chartProgress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, Math.max(percentage * 2, 20)],
                      }),
                      backgroundColor: item.color || '#3B82F6',
                      opacity: isSelected ? 1 : 0.82,
                    }}
                  />
                  <Text className="text-xs text-muted text-center w-12">{item.label}</Text>
                  {showValues && (
                    <Text className="text-xs font-semibold text-foreground">{item.value}</Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      ) : (
        <View className="gap-3">
          {data.map((item, index) => {
            const percentage = (item.value / max) * 100;
            const isSelected = selectedBar?.label === item.label;
            return (
              <Pressable
                key={`${item.label}-${index}`}
                accessibilityRole="button"
                accessibilityLabel={`Show details for ${item.label}`}
                onPress={() => setSelectedBar({
                  label: item.label,
                  value: item.value,
                  percentage,
                  share: getMetricShare(item.value, total),
                  rank: getMetricRank(item.value, values),
                })}
                style={({ pressed }) => [
                  { gap: 4 },
                  pressed && { opacity: 0.7 },
                ]}
              >
                <View className="flex-row justify-between items-center">
                  <Text className="text-sm font-semibold text-foreground flex-1">{item.label}</Text>
                  {showValues && (
                    <Text className="text-sm font-semibold text-foreground">{item.value}</Text>
                  )}
                </View>
                <View className="h-2 rounded-full bg-border" style={{ width: '100%' }}>
                  <Animated.View
                    className="h-2 rounded-full"
                    style={{
                      width: chartProgress.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', `${percentage}%`],
                      }),
                      backgroundColor: item.color || '#3B82F6',
                      opacity: isSelected ? 1 : 0.82,
                    }}
                  />
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

export default BarChart;
