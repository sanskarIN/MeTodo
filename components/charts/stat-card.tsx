// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

/**
 * FILE PURPOSE: Stat Card Component
 * 
 * Reusable stat card component for displaying key metrics
 * and KPIs in MeTodo analytics.
 * 
 * Features:
 * - Icon support
 * - Trend indicators
 * - Customizable colors
 * - Responsive design
 */

import React from 'react';
import { View, Text } from 'react-native';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  color?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down' | 'stable';
  };
  subtitle?: string;
}

/**
 * Stat Card Component
 */
export function StatCard({
  title,
  value,
  unit,
  icon,
  color = '#3B82F6',
  trend,
  subtitle,
}: StatCardProps) {
  const getTrendIcon = () => {
    if (!trend) return null;

    if (trend.direction === 'up') {
      return '📈';
    } else if (trend.direction === 'down') {
      return '📉';
    } else {
      return '➡️';
    }
  };

  const getTrendColor = () => {
    if (!trend) return 'text-muted';

    if (trend.direction === 'up') {
      return 'text-success';
    } else if (trend.direction === 'down') {
      return 'text-error';
    } else {
      return 'text-muted';
    }
  };

  return (
    <View className="bg-surface rounded-lg p-4 border border-border flex-1 m-2">
      {/* Header */}
      <View className="flex-row justify-between items-start mb-3">
        <Text className="text-sm font-semibold text-muted flex-1">{title}</Text>
        {icon && <Text className="text-lg">{icon}</Text>}
      </View>

      {/* Value */}
      <View className="mb-3">
        <View className="flex-row items-baseline gap-1">
          <Text
            className="text-3xl font-bold text-foreground"
            style={{ color }}
          >
            {value}
          </Text>
          {unit && <Text className="text-sm text-muted">{unit}</Text>}
        </View>
        {subtitle && <Text className="text-xs text-muted mt-1">{subtitle}</Text>}
      </View>

      {/* Trend */}
      {trend && (
        <View className={`flex-row items-center gap-1 ${getTrendColor()}`}>
          <Text className="text-lg">{getTrendIcon()}</Text>
          <Text className="text-xs font-semibold">
            {trend.value > 0 ? '+' : ''}
            {trend.value.toFixed(1)}%
          </Text>
        </View>
      )}
    </View>
  );
}

export default StatCard;
