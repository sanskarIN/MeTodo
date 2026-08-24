import { useMemo } from 'react';

/**
 * Performance utility hook to optimize heavy task filtering and sorting operations.
 */
export function useOptimizedTasks(tasks: any[], filterFn: (task: any) => boolean, sortFn?: (a: any, b: any) => number) {
  return useMemo(() => {
    const filtered = tasks.filter(filterFn);
    if (sortFn) {
      return filtered.sort(sortFn);
    }
    return filtered;
  }, [tasks, filterFn, sortFn]);
}

/**
 * Debounce utility for high-frequency input events.
 */
export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}
