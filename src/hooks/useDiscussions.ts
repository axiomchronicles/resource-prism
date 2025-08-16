import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getDiscussions, 
  createDiscussion, 
  getDiscussionReplies, 
  createDiscussionReply,
  subscribeToDiscussions
} from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import type { Database } from '@/integrations/supabase/types';

export const useDiscussions = (filters?: {
  subject?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) => {
  return useQuery({
    queryKey: ['discussions', filters],
    queryFn: () => getDiscussions(filters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useDiscussionReplies = (discussionId: string) => {
  return useQuery({
    queryKey: ['discussion-replies', discussionId],
    queryFn: () => getDiscussionReplies(discussionId),
    enabled: !!discussionId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useCreateDiscussion = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: createDiscussion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discussions'] });
      toast({
        title: 'Discussion created!',
        description: 'Your discussion has been posted to the community.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to create discussion',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useCreateReply = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: createDiscussionReply,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['discussion-replies', data.discussion_id] });
      queryClient.invalidateQueries({ queryKey: ['discussions'] });
      toast({
        title: 'Reply posted!',
        description: 'Your reply has been added to the discussion.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to post reply',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useDiscussionSubscription = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const subscription = subscribeToDiscussions((payload) => {
      queryClient.invalidateQueries({ queryKey: ['discussions'] });
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [queryClient]);
};