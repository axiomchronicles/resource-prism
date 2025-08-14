import { useState, useEffect } from 'react';
import { apiService, type Resource, type ApiResponse } from '@/services/api';

// Generic hook for API calls with loading states
export function useApiCall<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiCall();
      setData(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
}

// Hook for resources with filters
export function useResources(filters?: {
  type?: string;
  subject?: string;
  semester?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort_by?: string;
}) {
  const [data, setData] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<any>(null);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getResources(filters);
        setData(response.data);
        setPagination(response.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch resources');
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [JSON.stringify(filters)]);

  return { data, loading, error, pagination };
}

// Hook for search with debouncing
export function useSearch(query: string, delay: number = 300) {
  const [results, setResults] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.searchResources(query);
        setResults(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
      } finally {
        setLoading(false);
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [query, delay]);

  return { results, loading, error };
}

// Hook for trending resources
export function useTrending() {
  return useApiCall(() => apiService.getTrendingResources());
}

// Hook for featured resources
export function useFeatured() {
  return useApiCall(() => apiService.getFeaturedResources());
}

// Hook for user favorites
export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await apiService.getUserFavorites();
        setFavorites(response.data.map(resource => resource.id));
      } catch (err) {
        console.error('Failed to fetch favorites:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const toggleFavorite = async (resourceId: string) => {
    try {
      await apiService.toggleFavorite(resourceId);
      setFavorites(prev => 
        prev.includes(resourceId)
          ? prev.filter(id => id !== resourceId)
          : [...prev, resourceId]
      );
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  return { favorites, loading, toggleFavorite };
}

// Hook for stats
export function useStats() {
  return useApiCall(() => apiService.getStats());
}