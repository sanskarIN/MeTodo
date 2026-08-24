import React, { useEffect, useRef, useState, type ReactNode } from 'react';
import { Animated } from 'react-native';

import { useChartAnimationSettings } from '@/hooks/use-chart-animation-settings';

interface AnimatedTooltipProps {
  visible: boolean;
  contentKey: string;
  children: ReactNode;
  className?: string;
}

/**
 * Shared tooltip surface with a subtle fade/slide transition.
 * The contentKey lets charts animate metric updates without unmounting the
 * tooltip surface, which keeps the layout stable for screen readers and touch.
 */
export function AnimatedTooltip({
  visible,
  contentKey,
  children,
  className = 'bg-background rounded-lg border border-primary p-3 mb-3',
}: AnimatedTooltipProps) {
  const { reducedMotion, getDuration } = useChartAnimationSettings();
  const [mounted, setMounted] = useState(visible);
  const opacity = useRef(new Animated.Value(visible ? 1 : 0)).current;
  const translateY = useRef(new Animated.Value(visible ? 0 : 6)).current;
  const scale = useRef(new Animated.Value(visible ? 1 : 0.98)).current;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      if (reducedMotion) {
        opacity.setValue(1);
        translateY.setValue(0);
        scale.setValue(1);
        return;
      }

      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: getDuration(220), useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: getDuration(220), useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: getDuration(220), useNativeDriver: true }),
      ]).start();
      return;
    }

    if (reducedMotion) {
      opacity.setValue(0);
      translateY.setValue(6);
      scale.setValue(0.98);
      setMounted(false);
      return;
    }

    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: getDuration(160), useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 6, duration: getDuration(160), useNativeDriver: true }),
      Animated.timing(scale, { toValue: 0.98, duration: getDuration(160), useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (finished) setMounted(false);
    });
  }, [getDuration, opacity, translateY, scale, reducedMotion, visible]);

  useEffect(() => {
    if (!visible || reducedMotion) return;

    opacity.stopAnimation();
    translateY.stopAnimation();
    Animated.parallel([
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.55, duration: getDuration(90), useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: getDuration(180), useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(translateY, { toValue: 2, duration: getDuration(90), useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: getDuration(180), useNativeDriver: true }),
      ]),
    ]).start();
  }, [contentKey, getDuration, opacity, translateY, reducedMotion, visible]);

  if (!mounted) return null;

  return (
    <Animated.View
      className={className}
      style={{ opacity, transform: [{ translateY }, { scale }] }}
      accessibilityLiveRegion="polite"
    >
      {children}
    </Animated.View>
  );
}

export default AnimatedTooltip;
