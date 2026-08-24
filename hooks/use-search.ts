// =============================================================================
// (c) Copyright Sanskar Yadav. All rights reserved.
// Made by Sanskar Yadav.
// =============================================================================

/**
 * FILE PURPOSE: useSearch Hook
 * 
 * Custom React hook for search functionality in MeTodo including
 * search state management, filtering, and results handling.
 * 
 * Features:
 * - Search state management
 * - Debounced search
 * - Filter management
 * - Results caching
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import SearchUtil, { SearchFilter, SearchResult } from '@/lib/search-utils';

/**
 * useSearch hook
 */
export function useSearch(tasks: any[], debounceDelay: number = 300) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [filters, setFilters] = useState<SearchFilter>({});
  const [isSearching, setIsSearching] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  /**
   * Perform search
   */
  const performSearch = useCallback((): void => {
    setIsSearching(true);

    try {
      let searchResults: any[] = tasks;

      // Apply filters
      if (Object.keys(filters).length > 0) {
        searchResults = SearchUtil.filter(tasks, filters);
      }

      // Apply query
      if (query.trim()) {
        const ranked = SearchUtil.searchWithRanking(searchResults, query);
        setResults(ranked);
      } else {
        setResults(
          searchResults.map((task) => ({
            task,
            score: 0,
            highlights: {},
          }))
        );
      }
    } finally {
      setIsSearching(false);
    }
  }, [tasks, query, filters]);

  /**
   * Handle query change with debounce
   */
  const handleQueryChange = useCallback((newQuery: string) => {
    setQuery(newQuery);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current as NodeJS.Timeout);
    }

    debounceTimer.current = setTimeout(() => {
      performSearch();
    }, debounceDelay) as unknown as NodeJS.Timeout;
  }, [performSearch, debounceDelay]);

  /**
   * Update filters
   */
  const updateFilters = useCallback((newFilters: Partial<SearchFilter>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }));
  }, []);

  /**
   * Clear filters
   */
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  /**
   * Clear search
   */
  const clearSearch = useCallback(() => {
    setQuery('');
    setResults(
      tasks.map((task) => ({
        task,
        score: 0,
        highlights: {},
      }))
    );
  }, [tasks]);

  /**
   * Get suggestions
   */
  const getSuggestions = useCallback(
    (limit: number = 5): string[] => {
      return SearchUtil.getSuggestions(tasks, query, limit);
    },
    [tasks, query]
  );

  /**
   * Perform search on mount and when tasks change
   */
  useEffect(() => {
    performSearch();
  }, [tasks]);

  return {
    query,
    results,
    filters,
    isSearching,
    handleQueryChange,
    updateFilters,
    clearFilters,
    clearSearch,
    getSuggestions,
    resultCount: results.length,
  };
}

export default useSearch;
