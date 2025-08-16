import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getResources, 
  getFeaturedResources, 
  getTrendingResources,
  uploadResource,
  toggleFavorite,
  getUserFavorites,
  incrementViewCount,
  incrementDownloadCount,
  subscribeToResourceUpdates
} from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

export const useResources = (filters?: {
  type?: string;
  subject?: string;
  semester?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) => {
  return useQuery({
    queryKey: ['resources', filters],
    queryFn: () => getResources(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFeaturedResources = () => {
  return useQuery({
    queryKey: ['featured-resources'],
    queryFn: getFeaturedResources,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useTrendingResources = () => {
  return useQuery({
    queryKey: ['trending-resources'],
    queryFn: getTrendingResources,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUserFavorites = () => {
  return useQuery({
    queryKey: ['user-favorites'],
    queryFn: getUserFavorites,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useUploadResource = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: uploadResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast({
        title: 'Resource uploaded successfully!',
        description: 'Your resource is now available to the community.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: toggleFavorite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-favorites'] });
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useIncrementView = () => {
  return useMutation({
    mutationFn: incrementViewCount,
    onError: (error: Error) => {
      console.error('Failed to increment view count:', error);
    },
  });
};

export const useIncrementDownload = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: incrementDownloadCount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      toast({
        title: 'Download started',
        description: 'The file is being downloaded.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Download failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useResourceSubscription = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const subscription = subscribeToResourceUpdates((payload) => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      queryClient.invalidateQueries({ queryKey: ['trending-resources'] });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);
};