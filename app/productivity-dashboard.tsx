// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

/**
 * FILE PURPOSE: Productivity Dashboard Screen
 *
 * Productivity analytics with interactive charts and selectable reporting
 * windows. Users can choose the last 7 days, last 30 days, or enter an
 * inclusive custom range in YYYY-MM-DD format.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Alert, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Line, Polygon, Text as SvgText } from 'react-native-svg';
import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system/legacy';
import { ScreenContainer } from '@/components/screen-container';
import { StatCard } from '@/components/charts/stat-card';
import { BarChart } from '@/components/charts/bar-chart';
import { PieChart } from '@/components/charts/pie-chart';
import { LineChart } from '@/components/charts/line-chart';
import { AnimatedTooltip } from '@/components/charts/animated-tooltip';
import { useChartAnimationSettings } from '@/hooks/use-chart-animation-settings';
import { formatSignedMetric, getMetricShare, getNormalizedMetric } from '@/lib/chart-tooltip-metrics';
import { AnalyticsDataService, type AnalyticsDateRange,
  type AnalyticsRangeComparison,
  type CategoryComparison,
  type PriorityComparison,
} from '@/lib/analytics-data-service';
import { useTaskContext } from '@/lib/task-context';
import {
  createPriorityComparisonFilename,
  serializePriorityComparisonToCSV,
} from '@/lib/priority-comparison-export';
import { createChartAnimationSettingsTarget } from '@/lib/settings-navigation';

type RangeMode = 'week' | 'month' | 'custom';
type ComparisonMode = 'automatic' | 'manual';
type PriorityVisualization = 'bar' | 'radar';
type PickerTarget = 'start' | 'end' | 'previousStart' | 'previousEnd' | null;

async function downloadCSVFile(content: string, filename: string): Promise<string> {
  if (Platform.OS === 'web') {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
    return filename;
  }

  const directory = FileSystem.documentDirectory;
  if (!directory) throw new Error('The device document directory is unavailable.');
  const filePath = `${directory}${filename}`;
  await FileSystem.writeAsStringAsync(filePath, content);
  return filePath;
}

function startOfDay(date: Date): Date {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function endOfDay(date: Date): Date {
  const value = new Date(date);
  value.setHours(23, 59, 59, 999);
  return value;
}

function formatDateInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDateInput(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function createPresetRange(days: number): AnalyticsDateRange {
  const end = endOfDay(new Date());
  const start = startOfDay(new Date(end));
  start.setDate(start.getDate() - (days - 1));
  return { start, end };
}

function createAutomaticPreviousRange(range: AnalyticsDateRange): AnalyticsDateRange {
  const currentStart = startOfDay(range.start);
  const currentEnd = endOfDay(range.end);
  const durationMs = currentEnd.getTime() - currentStart.getTime() + 1;
  const end = new Date(currentStart.getTime() - 1);
  const start = new Date(end.getTime() - durationMs + 1);
  return { start, end };
}

interface ComparisonMetricProps {
  label: string;
  current: number;
  previous: number;
  format?: (value: number) => string;
  positiveWhenIncreasing?: boolean;
}

function ComparisonMetric({
  label,
  current,
  previous,
  format = (value) => value.toFixed(0),
  positiveWhenIncreasing = true,
}: ComparisonMetricProps) {
  const progress = useRef(new Animated.Value(0)).current;
  const { reducedMotion, getDuration } = useChartAnimationSettings();
  const delta = current - previous;
  const maximum = Math.max(current, previous, 1);
  const currentWidth = `${Math.min((current / maximum) * 100, 100)}%`;
  const previousWidth = `${Math.min((previous / maximum) * 100, 100)}%`;
  const isImprovement = positiveWhenIncreasing ? delta >= 0 : delta <= 0;
  const deltaText = `${delta > 0 ? '+' : ''}${format(delta)}`;

  useEffect(() => {
    progress.stopAnimation();
    progress.setValue(0);
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: getDuration(420),
      useNativeDriver: false,
    });
    animation.start();
    return () => animation.stop();
  }, [current, getDuration, previous, progress, reducedMotion]);

  return (
    <View className="bg-background rounded-lg p-3 border border-border">
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-sm font-semibold text-foreground">{label}</Text>
        <View className={`rounded-full px-2 py-1 ${isImprovement ? 'bg-success' : 'bg-error'}`}>
          <Text className="text-xs font-bold text-background">{deltaText}</Text>
        </View>
      </View>
      <View className="gap-2">
        <View>
          <View className="flex-row justify-between mb-1">
            <Text className="text-xs text-muted">Current</Text>
            <Text className="text-xs font-semibold text-foreground">{format(current)}</Text>
          </View>
          <View className="h-2 rounded-full bg-border overflow-hidden">
            <Animated.View
              className="h-2 rounded-full bg-primary"
              style={{
                width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', currentWidth] }),
              }}
            />
          </View>
        </View>
        <View>
          <View className="flex-row justify-between mb-1">
            <Text className="text-xs text-muted">Previous</Text>
            <Text className="text-xs font-semibold text-foreground">{format(previous)}</Text>
          </View>
          <View className="h-2 rounded-full bg-border overflow-hidden">
            <Animated.View
              className="h-2 rounded-full bg-muted"
              style={{
                width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', previousWidth] }),
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

function ComparisonPanel({ comparison }: { comparison: AnalyticsRangeComparison }) {
  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  return (
    <View className="bg-surface rounded-lg p-4 mb-6 border border-border">
      <Text className="text-lg font-bold text-foreground mb-1">Range Comparison</Text>
      <Text className="text-xs text-muted mb-1">
        Current: {formatDate(comparison.currentRange.start)} to {formatDate(comparison.currentRange.end)}
      </Text>
      <Text className="text-xs text-muted mb-3">
        Previous: {formatDate(comparison.previousRange.start)} to {formatDate(comparison.previousRange.end)}
      </Text>
      <View className="gap-3">
        <ComparisonMetric
          label="Completed tasks"
          current={comparison.current.completedTasks}
          previous={comparison.previous.completedTasks}
        />
        <ComparisonMetric
          label="Completion rate"
          current={comparison.current.completionRate * 100}
          previous={comparison.previous.completionRate * 100}
          format={(value) => `${value.toFixed(1)}%`}
        />
        <ComparisonMetric
          label="Overdue tasks"
          current={comparison.current.overdueTasks}
          previous={comparison.previous.overdueTasks}
          positiveWhenIncreasing={false}
        />
      </View>
    </View>
  );
}

function CategoryComparisonChart({ data }: { data: CategoryComparison[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const chartProgress = useRef(new Animated.Value(1)).current;
  const { reducedMotion, getDuration } = useChartAnimationSettings();
  const dataSignature = data
    .map((item) => `${item.category}:${item.currentCompletedTasks}:${item.previousCompletedTasks}:${item.currentTotalTasks}:${item.previousTotalTasks}`)
    .join('|');
  const maxValue = Math.max(
    ...data.map((item) => Math.max(item.currentCompletedTasks, item.previousCompletedTasks)),
    1,
  );
  const currentCompletedTotal = data.reduce((sum, item) => sum + item.currentCompletedTasks, 0);
  const previousCompletedTotal = data.reduce((sum, item) => sum + item.previousCompletedTasks, 0);
  const selectedItem = data.find((item) => item.category === selectedCategory) ?? null;

  useEffect(() => {
    chartProgress.stopAnimation();
    chartProgress.setValue(0);
    const animation = Animated.timing(chartProgress, {
      toValue: 1,
      duration: getDuration(420),
      useNativeDriver: false,
    });
    animation.start();
    return () => animation.stop();
  }, [chartProgress, dataSignature, getDuration, reducedMotion]);

  return (
    <View className="bg-surface rounded-lg p-4 mb-6 border border-border">
      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-lg font-bold text-foreground">Category Performance Comparison</Text>
        <View className="flex-row items-center gap-2">
          <View className="flex-row items-center gap-1">
            <View className="w-2 h-2 rounded-full bg-primary" />
            <Text className="text-xs text-muted">Current</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <View className="w-2 h-2 rounded-full bg-muted" />
            <Text className="text-xs text-muted">Previous</Text>
          </View>
        </View>
      </View>
      <Text className="text-xs text-muted mb-3">Completed tasks by category. Tap a row for detailed rate and volume metrics.</Text>

      <AnimatedTooltip
        visible={Boolean(selectedItem)}
        contentKey={selectedItem ? `${selectedItem.category}:${selectedItem.currentCompletedTasks}:${selectedItem.previousCompletedTasks}:${selectedItem.completionRateDelta}` : 'empty'}
      >
        {selectedItem && (
          <>
            <Text className="text-sm font-bold text-foreground">{selectedItem.category}</Text>
            <View className="flex-row justify-between mt-2">
              <Text className="text-xs text-muted">Completed tasks</Text>
              <Text className="text-xs font-semibold text-foreground">
                {selectedItem.currentCompletedTasks} current / {selectedItem.previousCompletedTasks} previous
              </Text>
            </View>
            <View className="flex-row justify-between mt-1">
              <Text className="text-xs text-muted">Volume change</Text>
              <Text className={`text-xs font-semibold ${selectedItem.currentCompletedTasks - selectedItem.previousCompletedTasks >= 0 ? 'text-success' : 'text-error'}`}>
                {selectedItem.currentCompletedTasks - selectedItem.previousCompletedTasks > 0 ? '+' : ''}{selectedItem.currentCompletedTasks - selectedItem.previousCompletedTasks}
              </Text>
            </View>
            <View className="flex-row justify-between mt-1">
              <Text className="text-xs text-muted">Completion rate</Text>
              <Text className="text-xs font-semibold text-foreground">
                {(selectedItem.currentCompletionRate * 100).toFixed(1)}% / {(selectedItem.previousCompletionRate * 100).toFixed(1)}%
              </Text>
            </View>
            <View className="flex-row justify-between mt-1">
              <Text className="text-xs text-muted">Rate change</Text>
              <Text className={`text-xs font-semibold ${selectedItem.completionRateDelta >= 0 ? 'text-success' : 'text-error'}`}>
                {selectedItem.completionRateDelta > 0 ? '+' : ''}{(selectedItem.completionRateDelta * 100).toFixed(1)} pp
              </Text>
            </View>
            <View className="flex-row justify-between mt-1">
              <Text className="text-xs text-muted">Share of completed</Text>
              <Text className="text-xs font-semibold text-foreground">
                {currentCompletedTotal > 0 ? ((selectedItem.currentCompletedTasks / currentCompletedTotal) * 100).toFixed(1) : '0.0'}% / {previousCompletedTotal > 0 ? ((selectedItem.previousCompletedTasks / previousCompletedTotal) * 100).toFixed(1) : '0.0'}%
              </Text>
            </View>
            <View className="flex-row justify-between mt-1">
              <Text className="text-xs text-muted">Total tasks</Text>
              <Text className="text-xs font-semibold text-foreground">
                {selectedItem.currentTotalTasks} current / {selectedItem.previousTotalTasks} previous
              </Text>
            </View>
          </>
        )}
      </AnimatedTooltip>

      {data.length === 0 ? (
        <Text className="text-sm text-muted">No category data is available for either comparison range.</Text>
      ) : (
        <View className="gap-3">
          {data.slice(0, 8).map((item) => {
            const currentWidth = `${Math.min((item.currentCompletedTasks / maxValue) * 100, 100)}%`;
            const previousWidth = `${Math.min((item.previousCompletedTasks / maxValue) * 100, 100)}%`;
            const isSelected = selectedCategory === item.category;
            const rateDelta = item.completionRateDelta * 100;
            const rateDeltaLabel = `${rateDelta > 0 ? '+' : ''}${rateDelta.toFixed(1)} pp`;

            return (
              <TouchableOpacity
                key={item.category}
                onPress={() => setSelectedCategory(isSelected ? null : item.category)}
                className={`rounded-lg p-2 ${isSelected ? 'bg-background border border-primary' : ''}`}
                accessibilityRole="button"
                accessibilityLabel={`Inspect ${item.category} category comparison`}
              >
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-sm font-semibold text-foreground flex-1">{item.category}</Text>
                  <Text className={`text-xs font-bold ${rateDelta >= 0 ? 'text-success' : 'text-error'}`}>
                    {rateDeltaLabel}
                  </Text>
                </View>
                <View className="gap-1">
                  <View className="h-2 rounded-full bg-border overflow-hidden">
                    <Animated.View
                      className="h-2 rounded-full bg-primary"
                      style={{
                        width: chartProgress.interpolate({ inputRange: [0, 1], outputRange: ['0%', currentWidth] }),
                      }}
                    />
                  </View>
                  <View className="h-2 rounded-full bg-border overflow-hidden">
                    <Animated.View
                      className="h-2 rounded-full bg-muted"
                      style={{
                        width: chartProgress.interpolate({ inputRange: [0, 1], outputRange: ['0%', previousWidth] }),
                      }}
                    />
                  </View>
                </View>

              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

interface PriorityRadarChartProps {
  data: PriorityComparison[];
  maxValue: number;
  progress: Animated.Value;
  priorityColors: Record<string, string>;
  selectedPriority: string | null;
  onSelect: (priority: string) => void;
}

function PriorityRadarChart({
  data,
  maxValue,
  progress,
  priorityColors,
  selectedPriority,
  onSelect,
}: PriorityRadarChartProps) {
  const visibleData = data.slice(0, 5);
  const width = 320;
  const height = 260;
  const centerX = width / 2;
  const centerY = 116;
  const radius = 82;
  const angleForIndex = (index: number) => -Math.PI / 2 + (index * Math.PI * 2) / Math.max(visibleData.length, 1);
  const pointForValue = (index: number, value: number) => {
    const normalized = getNormalizedMetric(value, maxValue);
    const angle = angleForIndex(index);
    return {
      x: centerX + Math.cos(angle) * radius * normalized,
      y: centerY + Math.sin(angle) * radius * normalized,
    };
  };
  const pointString = (values: number[]) => values
    .map((value, index) => {
      const point = pointForValue(index, value);
      return `${point.x},${point.y}`;
    })
    .join(' ');
  const axisPoint = (index: number) => {
    const angle = angleForIndex(index);
    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    };
  };

  return (
    <View className="items-center">
      <Animated.View
        style={{
          opacity: progress,
          transform: [{ scale: progress.interpolate({ inputRange: [0, 1], outputRange: [0.94, 1] }) }],
        }}
      >
        <Svg width={width} height={height} accessibilityLabel="Priority radar comparison chart">
          {[0.25, 0.5, 0.75, 1].map((level) => (
            <Polygon
              key={`radar-grid-${level}`}
              points={visibleData.map((_, index) => {
                const point = pointForValue(index, maxValue * level);
                return `${point.x},${point.y}`;
              }).join(' ')}
              fill="none"
              stroke="#CBD5E1"
              strokeWidth={1}
              opacity={0.7}
            />
          ))}
          {visibleData.map((item, index) => {
            const point = axisPoint(index);
            return (
              <React.Fragment key={`radar-axis-${item.priority}`}>
                <Line x1={centerX} y1={centerY} x2={point.x} y2={point.y} stroke="#CBD5E1" strokeWidth={1} />
                <SvgText
                  x={centerX + Math.cos(angleForIndex(index)) * (radius + 22)}
                  y={centerY + Math.sin(angleForIndex(index)) * (radius + 22)}
                  fill="#64748B"
                  fontSize={11}
                  textAnchor="middle"
                >
                  {item.priority}
                </SvgText>
              </React.Fragment>
            );
          })}
          <Polygon
            points={pointString(visibleData.map((item) => item.currentCompletedTasks))}
            fill="#0A7EA4"
            fillOpacity={0.22}
            stroke="#0A7EA4"
            strokeWidth={2}
          />
          <Polygon
            points={pointString(visibleData.map((item) => item.previousCompletedTasks))}
            fill="#687076"
            fillOpacity={0.18}
            stroke="#687076"
            strokeWidth={2}
            strokeDasharray="5,4"
          />
          {visibleData.map((item, index) => {
            const currentPoint = pointForValue(index, item.currentCompletedTasks);
            const previousPoint = pointForValue(index, item.previousCompletedTasks);
            const isSelected = selectedPriority === item.priority;
            return (
              <React.Fragment key={`radar-points-${item.priority}`}>
                <Circle cx={currentPoint.x} cy={currentPoint.y} r={isSelected ? 6 : 4} fill={priorityColors[item.priority.toLowerCase()] || '#0A7EA4'} />
                <Circle cx={previousPoint.x} cy={previousPoint.y} r={isSelected ? 5 : 3} fill="#687076" opacity={0.9} />
              </React.Fragment>
            );
          })}
        </Svg>
      </Animated.View>
      <View className="w-full gap-2 mt-1">
        {visibleData.map((item) => {
          const isSelected = selectedPriority === item.priority;
          const priorityColor = priorityColors[item.priority.toLowerCase()] || '#0A7EA4';
          return (
            <TouchableOpacity
              key={`radar-select-${item.priority}`}
              onPress={() => onSelect(item.priority)}
              className={`flex-row items-center justify-between rounded-lg px-2 py-1 ${isSelected ? 'bg-background border border-primary' : ''}`}
              accessibilityRole="button"
              accessibilityLabel={`Inspect ${item.priority} priority radar metrics`}
            >
              <View className="flex-row items-center gap-2">
                <View className="w-2 h-2 rounded-full" style={{ backgroundColor: priorityColor }} />
                <Text className="text-xs font-semibold text-foreground">{item.priority}</Text>
              </View>
              <Text className="text-xs text-muted">{item.currentCompletedTasks} current / {item.previousCompletedTasks} previous</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function PriorityComparisonChart({
  data,
  currentRange,
  previousRange,
}: {
  data: PriorityComparison[];
  currentRange: AnalyticsDateRange;
  previousRange: AnalyticsDateRange;
}) {
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [visualization, setVisualization] = useState<PriorityVisualization>('bar');
  const chartProgress = useRef(new Animated.Value(1)).current;
  const { reducedMotion, getDuration } = useChartAnimationSettings();
  const dataSignature = data
    .map((item) => `${item.priority}:${item.currentCompletedTasks}:${item.previousCompletedTasks}:${item.currentTotalTasks}:${item.previousTotalTasks}`)
    .join('|');
  const maxValue = Math.max(
    ...data.map((item) => Math.max(item.currentCompletedTasks, item.previousCompletedTasks)),
    1,
  );
  const currentCompletedTotal = data.reduce((sum, item) => sum + item.currentCompletedTasks, 0);
  const previousCompletedTotal = data.reduce((sum, item) => sum + item.previousCompletedTasks, 0);
  const selectedItem = data.find((item) => item.priority === selectedPriority) ?? null;
  const priorityColors: Record<string, string> = {
    urgent: '#8B5CF6',
    high: '#EF4444',
    medium: '#F59E0B',
    low: '#10B981',
  };

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const ranges = { currentRange, previousRange };
      const filename = createPriorityComparisonFilename(ranges);
      const content = serializePriorityComparisonToCSV(data, ranges);
      const destination = await downloadCSVFile(content, filename);
      Alert.alert(
        'Priority CSV exported',
        Platform.OS === 'web' ? `${filename} was downloaded.` : `Saved to ${destination}`,
      );
    } catch (error) {
      console.error('Error exporting priority comparison CSV:', error);
      Alert.alert('Export failed', 'The priority comparison CSV could not be created.');
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    chartProgress.stopAnimation();
    chartProgress.setValue(0);
    const animation = Animated.timing(chartProgress, {
      toValue: 1,
      duration: getDuration(420),
      useNativeDriver: false,
    });
    animation.start();
    return () => animation.stop();
  }, [chartProgress, dataSignature, getDuration, reducedMotion]);

  return (
    <View className="bg-surface rounded-lg p-4 mb-6 border border-border">
      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-lg font-bold text-foreground flex-1">Priority Performance Comparison</Text>
        <View className="flex-row items-center gap-2">
          <TouchableOpacity
            onPress={handleExportCSV}
            disabled={isExporting}
            style={{ opacity: isExporting ? 0.6 : 1 }}
            className="rounded-md border border-primary px-2 py-1"
            accessibilityRole="button"
            accessibilityLabel="Export priority performance as CSV"
            accessibilityHint="Downloads the current and previous priority comparison data as a CSV file"
          >
            <Text className="text-[10px] font-semibold text-primary">{isExporting ? 'Exporting…' : 'Export CSV'}</Text>
          </TouchableOpacity>
          <View className="flex-row items-center gap-1">
            <View className="w-2 h-2 rounded-full bg-primary" />
            <Text className="text-xs text-muted">Current</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <View className="w-2 h-2 rounded-full bg-muted" />
            <Text className="text-xs text-muted">Previous</Text>
          </View>
        </View>
      </View>
      <Text className="text-xs text-muted mb-3">Completed tasks by priority. Switch views and tap a priority for detailed rate and volume metrics.</Text>
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-xs font-semibold text-muted">Visualization</Text>
        <View className="flex-row rounded-lg bg-background border border-border p-1">
          <TouchableOpacity
            onPress={() => setVisualization('bar')}
            className={`rounded-md px-3 py-1 ${visualization === 'bar' ? 'bg-primary' : ''}`}
            accessibilityRole="button"
            accessibilityState={{ selected: visualization === 'bar' }}
            accessibilityLabel="Show priority bar chart"
          >
            <Text className={`text-xs font-semibold ${visualization === 'bar' ? 'text-background' : 'text-muted'}`}>Bars</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setVisualization('radar')}
            className={`rounded-md px-3 py-1 ${visualization === 'radar' ? 'bg-primary' : ''}`}
            accessibilityRole="button"
            accessibilityState={{ selected: visualization === 'radar' }}
            accessibilityLabel="Show priority radar chart"
          >
            <Text className={`text-xs font-semibold ${visualization === 'radar' ? 'text-background' : 'text-muted'}`}>Radar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <AnimatedTooltip
        visible={Boolean(selectedItem)}
        contentKey={selectedItem ? `${selectedItem.priority}:${selectedItem.currentCompletedTasks}:${selectedItem.previousCompletedTasks}:${selectedItem.completionRateDelta}` : 'empty'}
      >
        {selectedItem && (
          <>
            <View className="flex-row items-center gap-2">
              <View className="w-3 h-3 rounded-full" style={{ backgroundColor: priorityColors[selectedItem.priority.toLowerCase()] || '#3B82F6' }} />
              <Text className="text-sm font-bold text-foreground">{selectedItem.priority}</Text>
            </View>
            <View className="flex-row justify-between mt-2">
              <Text className="text-xs text-muted">Completed tasks</Text>
              <Text className="text-xs font-semibold text-foreground">
                {selectedItem.currentCompletedTasks} current / {selectedItem.previousCompletedTasks} previous
              </Text>
            </View>
            <View className="flex-row justify-between mt-1">
              <Text className="text-xs text-muted">Volume change</Text>
              <Text className={`text-xs font-semibold ${selectedItem.currentCompletedTasks - selectedItem.previousCompletedTasks >= 0 ? 'text-success' : 'text-error'}`}>
                {formatSignedMetric(selectedItem.currentCompletedTasks - selectedItem.previousCompletedTasks, 0)}
              </Text>
            </View>
            <View className="flex-row justify-between mt-1">
              <Text className="text-xs text-muted">Completion rate</Text>
              <Text className="text-xs font-semibold text-foreground">
                {(selectedItem.currentCompletionRate * 100).toFixed(1)}% / {(selectedItem.previousCompletionRate * 100).toFixed(1)}%
              </Text>
            </View>
            <View className="flex-row justify-between mt-1">
              <Text className="text-xs text-muted">Rate change</Text>
              <Text className={`text-xs font-semibold ${selectedItem.completionRateDelta >= 0 ? 'text-success' : 'text-error'}`}>
                {formatSignedMetric(selectedItem.completionRateDelta * 100)} pp
              </Text>
            </View>
            <View className="flex-row justify-between mt-1">
              <Text className="text-xs text-muted">Share of completed</Text>
              <Text className="text-xs font-semibold text-foreground">
                {getMetricShare(selectedItem.currentCompletedTasks, currentCompletedTotal).toFixed(1)}% / {getMetricShare(selectedItem.previousCompletedTasks, previousCompletedTotal).toFixed(1)}%
              </Text>
            </View>
            <View className="flex-row justify-between mt-1">
              <Text className="text-xs text-muted">Total tasks</Text>
              <Text className="text-xs font-semibold text-foreground">
                {selectedItem.currentTotalTasks} current / {selectedItem.previousTotalTasks} previous
              </Text>
            </View>
          </>
        )}
      </AnimatedTooltip>

      {data.length === 0 ? (
        <Text className="text-sm text-muted">No priority data is available for either comparison range.</Text>
      ) : visualization === 'radar' ? (
        <PriorityRadarChart
          data={data}
          maxValue={maxValue}
          progress={chartProgress}
          priorityColors={priorityColors}
          selectedPriority={selectedPriority}
          onSelect={(priority) => setSelectedPriority(selectedPriority === priority ? null : priority)}
        />
      ) : (
        <View className="gap-3">
          {data.slice(0, 5).map((item) => {
            const currentWidth = `${Math.min((item.currentCompletedTasks / maxValue) * 100, 100)}%`;
            const previousWidth = `${Math.min((item.previousCompletedTasks / maxValue) * 100, 100)}%`;
            const isSelected = selectedPriority === item.priority;
            const rateDelta = item.completionRateDelta * 100;
            const priorityColor = priorityColors[item.priority.toLowerCase()] || '#3B82F6';

            return (
              <TouchableOpacity
                key={item.priority}
                onPress={() => setSelectedPriority(isSelected ? null : item.priority)}
                className={`rounded-lg p-2 ${isSelected ? 'bg-background border border-primary' : ''}`}
                accessibilityRole="button"
                accessibilityLabel={`Inspect ${item.priority} priority comparison`}
              >
                <View className="flex-row items-center justify-between mb-1">
                  <View className="flex-row items-center gap-2 flex-1">
                    <View className="w-2 h-2 rounded-full" style={{ backgroundColor: priorityColor }} />
                    <Text className="text-sm font-semibold text-foreground">{item.priority}</Text>
                  </View>
                  <Text className={`text-xs font-bold ${rateDelta >= 0 ? 'text-success' : 'text-error'}`}>
                    {formatSignedMetric(rateDelta)} pp
                  </Text>
                </View>
                <View className="gap-1">
                  <View className="h-2 rounded-full bg-border overflow-hidden">
                    <Animated.View
                      className="h-2 rounded-full bg-primary"
                      style={{
                        width: chartProgress.interpolate({ inputRange: [0, 1], outputRange: ['0%', currentWidth] }),
                      }}
                    />
                  </View>
                  <View className="h-2 rounded-full bg-border overflow-hidden">
                    <Animated.View
                      className="h-2 rounded-full bg-muted"
                      style={{
                        width: chartProgress.interpolate({ inputRange: [0, 1], outputRange: ['0%', previousWidth] }),
                      }}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

/**
 * Productivity Dashboard Screen
 */
export default function ProductivityDashboardScreen() {
  const router = useRouter();
  const { tasks } = useTaskContext();
  const [rangeMode, setRangeMode] = useState<RangeMode>('month');
  const [dateRange, setDateRange] = useState<AnalyticsDateRange>(() => createPresetRange(30));
  const [draftStart, setDraftStart] = useState(() => formatDateInput(createPresetRange(30).start));
  const [draftEnd, setDraftEnd] = useState(() => formatDateInput(createPresetRange(30).end));
  const [comparisonMode, setComparisonMode] = useState<ComparisonMode>('automatic');
  const [manualPreviousRange, setManualPreviousRange] = useState<AnalyticsDateRange>(() =>
    createAutomaticPreviousRange(createPresetRange(30)),
  );
  const [previousDraftStart, setPreviousDraftStart] = useState(() =>
    formatDateInput(createAutomaticPreviousRange(createPresetRange(30)).start),
  );
  const [previousDraftEnd, setPreviousDraftEnd] = useState(() =>
    formatDateInput(createAutomaticPreviousRange(createPresetRange(30)).end),
  );
  const [pickerTarget, setPickerTarget] = useState<PickerTarget>(null);

  const rangeTasks = useMemo(() => {
    const start = startOfDay(dateRange.start).getTime();
    const end = endOfDay(dateRange.end).getTime();
    return tasks.filter((task) => {
      const createdAt = new Date(task.createdAt).getTime();
      return createdAt >= start && createdAt <= end;
    });
  }, [dateRange, tasks]);

  const analytics = useMemo(() => new AnalyticsDataService(rangeTasks), [rangeTasks]);
  const allAnalytics = useMemo(() => new AnalyticsDataService(tasks), [tasks]);
  const comparison = useMemo(
    () => allAnalytics.getRangeComparison(
      dateRange,
      comparisonMode === 'manual' ? manualPreviousRange : undefined,
    ),
    [allAnalytics, comparisonMode, dateRange, manualPreviousRange],
  );
  const summary = comparison.current;
  const categoryComparisons = useMemo(
    () => allAnalytics.getCategoryComparison(comparison.currentRange, comparison.previousRange),
    [allAnalytics, comparison.currentRange, comparison.previousRange],
  );
  const priorityComparisons = useMemo(
    () => allAnalytics.getPriorityComparison(comparison.currentRange, comparison.previousRange),
    [allAnalytics, comparison.currentRange, comparison.previousRange],
  );
  const categoryStats = analytics.getCategoryStats();
  const priorityStats = analytics.getPriorityStats();
  const trendPeriod = rangeMode === 'week' ? 'weekly' : 'monthly';
  const trends = analytics.getProductivityTrends(trendPeriod, dateRange);
  const dailyStats = analytics.getDailyStatsForRange(dateRange);

  const applyRange = (nextRange: AnalyticsDateRange, mode: RangeMode) => {
    const normalizedRange = {
      start: startOfDay(nextRange.start),
      end: endOfDay(nextRange.end),
    };

    if (normalizedRange.start.getTime() > normalizedRange.end.getTime()) {
      Alert.alert('Invalid date range', 'The start date must be on or before the end date.');
      return;
    }

    setDateRange(normalizedRange);
    setRangeMode(mode);
    setDraftStart(formatDateInput(normalizedRange.start));
    setDraftEnd(formatDateInput(normalizedRange.end));
  };

  const applyCustomRange = () => {
    const start = parseDateInput(draftStart);
    const end = parseDateInput(draftEnd);

    if (!start || !end) {
      Alert.alert('Invalid date', 'Use the YYYY-MM-DD format for both dates.');
      return;
    }

    applyRange({ start, end }, 'custom');
  };

  const applyManualPreviousRange = () => {
    const start = parseDateInput(previousDraftStart);
    const end = parseDateInput(previousDraftEnd);

    if (!start || !end) {
      Alert.alert('Invalid previous range', 'Use the YYYY-MM-DD format for both comparison dates.');
      return;
    }

    const normalizedRange = { start: startOfDay(start), end: endOfDay(end) };
    if (normalizedRange.start.getTime() > normalizedRange.end.getTime()) {
      Alert.alert('Invalid previous range', 'The previous start date must be on or before its end date.');
      return;
    }
    if (normalizedRange.end.getTime() >= startOfDay(dateRange.start).getTime()) {
      Alert.alert('Overlapping ranges', 'The previous range must end before the current range starts.');
      return;
    }

    setManualPreviousRange(normalizedRange);
    setComparisonMode('manual');
    setPreviousDraftStart(formatDateInput(normalizedRange.start));
    setPreviousDraftEnd(formatDateInput(normalizedRange.end));
    setPickerTarget(null);
  };

  const handleNativeDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setPickerTarget(null);
    }
    if (event.type === 'dismissed' || !selectedDate || !pickerTarget) {
      return;
    }

    if (pickerTarget === 'previousStart') {
      setPreviousDraftStart(formatDateInput(selectedDate));
      return;
    }
    if (pickerTarget === 'previousEnd') {
      setPreviousDraftEnd(formatDateInput(selectedDate));
      return;
    }

    const nextRange = pickerTarget === 'start'
      ? { start: selectedDate, end: dateRange.end }
      : { start: dateRange.start, end: selectedDate };
    applyRange(nextRange, 'custom');
  };

  const handleExport = () => {
    Alert.alert(
      'Export Analytics',
      'Choose export format:',
      [
        {
          text: 'JSON',
          onPress: () => {
            const json = analytics.exportToJSON();
            Alert.alert('Exported', `Analytics JSON generated (${json.length} characters).`);
          },
        },
        {
          text: 'CSV',
          onPress: () => {
            const csv = analytics.exportToCSV();
            Alert.alert('Exported', `Analytics CSV generated (${csv.length} characters).`);
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ],
    );
  };

  return (
    <ScreenContainer className="flex-1">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground mb-2">Productivity Dashboard</Text>
          <Text className="text-sm text-muted">
            Tap any chart bar, point, slice, or legend row to inspect its value.
          </Text>
        </View>

        <View className="bg-surface rounded-lg p-4 mb-6 border border-border">
          <Text className="text-lg font-bold text-foreground mb-2">Reporting Range</Text>
          <Text className="text-sm text-muted mb-3">
            {formatDateInput(dateRange.start)} to {formatDateInput(dateRange.end)}
          </Text>

          <View className="flex-row gap-2 mb-4">
            <TouchableOpacity
              onPress={() => applyRange(createPresetRange(7), 'week')}
              className={`flex-1 py-2 px-3 rounded-lg border ${
                rangeMode === 'week' ? 'bg-primary border-primary' : 'bg-background border-border'
              }`}
            >
              <Text className={`text-center font-semibold ${rangeMode === 'week' ? 'text-background' : 'text-foreground'}`}>
                Last 7 Days
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => applyRange(createPresetRange(30), 'month')}
              className={`flex-1 py-2 px-3 rounded-lg border ${
                rangeMode === 'month' ? 'bg-primary border-primary' : 'bg-background border-border'
              }`}
            >
              <Text className={`text-center font-semibold ${rangeMode === 'month' ? 'text-background' : 'text-foreground'}`}>
                Last 30 Days
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row gap-2">
            <View className="flex-1">
              <Text className="text-xs font-semibold text-muted mb-1">Start date</Text>
              <TextInput
                value={draftStart}
                onChangeText={setDraftStart}
                onSubmitEditing={applyCustomRange}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9BA1A6"
                keyboardType={Platform.OS === 'web' ? 'default' : 'numbers-and-punctuation'}
                returnKeyType="done"
                className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                accessibilityLabel="Custom range start date"
              />
            </View>
            <View className="flex-1">
              <Text className="text-xs font-semibold text-muted mb-1">End date</Text>
              <TextInput
                value={draftEnd}
                onChangeText={setDraftEnd}
                onSubmitEditing={applyCustomRange}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9BA1A6"
                keyboardType={Platform.OS === 'web' ? 'default' : 'numbers-and-punctuation'}
                returnKeyType="done"
                className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                accessibilityLabel="Custom range end date"
              />
            </View>
          </View>

          {Platform.OS !== 'web' && (
            <View className="flex-row gap-2 mt-3">
              <TouchableOpacity
                onPress={() => setPickerTarget('start')}
                className="flex-1 bg-background border border-border rounded-lg py-2 px-3"
              >
                <Text className="text-center text-foreground font-semibold">Pick Start</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setPickerTarget('end')}
                className="flex-1 bg-background border border-border rounded-lg py-2 px-3"
              >
                <Text className="text-center text-foreground font-semibold">Pick End</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity onPress={applyCustomRange} className="bg-primary rounded-lg py-2 px-4 mt-3">
            <Text className="text-center text-background font-semibold">Apply Custom Range</Text>
          </TouchableOpacity>

          <View className="border-t border-border mt-4 pt-4">
            <Text className="text-sm font-semibold text-foreground mb-2">Compare against</Text>
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={() => setComparisonMode('automatic')}
                className={`flex-1 rounded-lg border py-2 px-3 ${
                  comparisonMode === 'automatic' ? 'bg-primary border-primary' : 'bg-background border-border'
                }`}
              >
                <Text className={`text-center text-xs font-semibold ${comparisonMode === 'automatic' ? 'text-background' : 'text-foreground'}`}>
                  Previous window
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setComparisonMode('manual')}
                className={`flex-1 rounded-lg border py-2 px-3 ${
                  comparisonMode === 'manual' ? 'bg-primary border-primary' : 'bg-background border-border'
                }`}
              >
                <Text className={`text-center text-xs font-semibold ${comparisonMode === 'manual' ? 'text-background' : 'text-foreground'}`}>
                  Manual range
                </Text>
              </TouchableOpacity>
            </View>

            {comparisonMode === 'manual' && (
              <View className="mt-3">
                <Text className="text-xs text-muted mb-2">The manual range must end before the current range starts.</Text>
                <View className="flex-row gap-2">
                  <View className="flex-1">
                    <Text className="text-xs font-semibold text-muted mb-1">Previous start</Text>
                    <TextInput
                      value={previousDraftStart}
                      onChangeText={setPreviousDraftStart}
                      onSubmitEditing={applyManualPreviousRange}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor="#9BA1A6"
                      keyboardType={Platform.OS === 'web' ? 'default' : 'numbers-and-punctuation'}
                      returnKeyType="done"
                      className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                      accessibilityLabel="Manual comparison start date"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs font-semibold text-muted mb-1">Previous end</Text>
                    <TextInput
                      value={previousDraftEnd}
                      onChangeText={setPreviousDraftEnd}
                      onSubmitEditing={applyManualPreviousRange}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor="#9BA1A6"
                      keyboardType={Platform.OS === 'web' ? 'default' : 'numbers-and-punctuation'}
                      returnKeyType="done"
                      className="bg-background border border-border rounded-lg px-3 py-2 text-foreground"
                      accessibilityLabel="Manual comparison end date"
                    />
                  </View>
                </View>
                {Platform.OS !== 'web' && (
                  <View className="flex-row gap-2 mt-3">
                    <TouchableOpacity
                      onPress={() => setPickerTarget('previousStart')}
                      className="flex-1 bg-background border border-border rounded-lg py-2 px-3"
                    >
                      <Text className="text-center text-foreground font-semibold">Pick Previous Start</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setPickerTarget('previousEnd')}
                      className="flex-1 bg-background border border-border rounded-lg py-2 px-3"
                    >
                      <Text className="text-center text-foreground font-semibold">Pick Previous End</Text>
                    </TouchableOpacity>
                  </View>
                )}
                <TouchableOpacity onPress={applyManualPreviousRange} className="bg-primary rounded-lg py-2 px-4 mt-3">
                  <Text className="text-center text-background font-semibold">Apply Previous Range</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <TouchableOpacity
            onPress={() => router.push(createChartAnimationSettingsTarget())}
            className="bg-background border border-primary rounded-lg py-2.5 px-3 mt-3"
            accessibilityRole="button"
            accessibilityLabel="Open chart animation settings"
            accessibilityHint="Opens Settings and scrolls to chart animation preferences"
          >
            <Text className="text-center text-primary font-semibold">Open Chart Animation Settings</Text>
          </TouchableOpacity>

          {Platform.OS !== 'web' && pickerTarget && (
            <DateTimePicker
              value={
                pickerTarget === 'start'
                  ? dateRange.start
                  : pickerTarget === 'end'
                    ? dateRange.end
                    : pickerTarget === 'previousStart'
                      ? parseDateInput(previousDraftStart) ?? manualPreviousRange.start
                      : parseDateInput(previousDraftEnd) ?? manualPreviousRange.end
              }
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleNativeDateChange}
            />
          )}
        </View>

        <View className="mb-6">
          <Text className="text-lg font-bold text-foreground mb-3">Key Metrics</Text>
          <View className="flex-row flex-wrap">
            <StatCard
              title="Completion Rate"
              value={(summary.completionRate * 100).toFixed(0)}
              unit="%"
              color="#10B981"
              icon="📊"
              trend={{
                value: summary.completionRate > 0.7 ? 5 : -3,
                direction: summary.completionRate > 0.7 ? 'up' : 'down',
              }}
            />
            <StatCard title="Tasks Completed" value={summary.completedTasks} color="#3B82F6" icon="✅" />
            <StatCard
              title="Pending Tasks"
              value={summary.pendingTasks}
              color="#F59E0B"
              icon="⏳"
              subtitle="Waiting to be completed"
            />
            <StatCard title="Overdue Tasks" value={summary.overdueTasks} color="#EF4444" icon="⚠️" />
          </View>
        </View>

        <ComparisonPanel comparison={comparison} />
        <CategoryComparisonChart data={categoryComparisons} />
        <PriorityComparisonChart
          data={priorityComparisons}
          currentRange={comparison.currentRange}
          previousRange={comparison.previousRange}
        />

        <View className="bg-surface rounded-lg p-4 mb-6 border border-border">
          <Text className="text-lg font-bold text-foreground mb-3">Insights</Text>
          <View className="gap-3">
            <View className="flex-row items-center gap-2">
              <Text className="text-lg">🏆</Text>
              <Text className="text-sm text-foreground flex-1">
                Most productive day: <Text className="font-bold">{summary.mostProductiveDay}</Text>
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Text className="text-lg">⏰</Text>
              <Text className="text-sm text-foreground flex-1">
                Most productive hour: <Text className="font-bold">{summary.mostProductiveHour}:00</Text>
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Text className="text-lg">🎯</Text>
              <Text className="text-sm text-foreground flex-1">
                Favorite category: <Text className="font-bold">{summary.favoriteCategory}</Text>
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Text className="text-lg">🔥</Text>
              <Text className="text-sm text-foreground flex-1">
                Current streak: <Text className="font-bold">{summary.streak} days</Text>
              </Text>
            </View>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-bold text-foreground mb-3">Completion Trends</Text>
          {dailyStats.length === 0 ? (
            <View className="bg-surface rounded-lg p-4 border border-border">
              <Text className="text-sm text-muted">No tasks were created in this date range.</Text>
            </View>
          ) : (
            <LineChart
              title="Daily Completion Rate"
              data={{
                labels: dailyStats.map((stat) => `${stat.date.getMonth() + 1}/${stat.date.getDate()}`),
                datasets: [
                  {
                    data: dailyStats.map((stat) => stat.completionRate * 100),
                    color: '#3B82F6',
                  },
                ],
              }}
              yAxisLabel="Completion rate"
              yAxisSuffix="%"
            />
          )}
        </View>

        {categoryStats.length > 0 && (
          <BarChart
            title="Category Performance"
            data={categoryStats.map((category) => ({
              label: category.category.substring(0, 12),
              value: category.completedTasks,
              color: '#10B981',
            }))}
            showValues
          />
        )}

        {priorityStats.length > 0 && (
          <PieChart
            title="Tasks by Priority"
            data={priorityStats.map((priority) => ({
              label: priority.priority,
              value: priority.totalTasks,
            }))}
            showLegend
          />
        )}

        <View className="mb-6">
          <Text className="text-lg font-bold text-foreground mb-3">
            {trendPeriod === 'weekly' ? 'Weekly Trends' : 'Monthly Trends'}
          </Text>
          {trends.length === 0 ? (
            <View className="bg-surface rounded-lg p-4 border border-border">
              <Text className="text-sm text-muted">No trend data is available for this range.</Text>
            </View>
          ) : (
            <BarChart
              title="Tasks Completed by Period"
              data={trends.map((trend) => ({
                label: trend.period.substring(0, 10),
                value: trend.tasksCompleted,
                color: trend.trend === 'up' ? '#10B981' : trend.trend === 'down' ? '#EF4444' : '#F59E0B',
              }))}
              horizontal
            />
          )}
        </View>

        <TouchableOpacity onPress={handleExport} className="bg-primary rounded-lg py-3 px-4 mb-6 active:opacity-80">
          <Text className="text-center text-background font-bold text-base">📥 Export Analytics</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenContainer>
  );
}
