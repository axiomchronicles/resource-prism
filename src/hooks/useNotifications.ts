import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getUserNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  subscribeToNotifications
} from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export const useNotifications = () => {
  const { profile } = useAuth();
  
  return useQuery({
    queryKey: ['notifications'],
    queryFn: getUserNotifications,
    enabled: !!profile,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: 'All notifications marked as read',
        description: 'Your notification list has been cleared.',
      });
    },
  });
};

export const useNotificationSubscription = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!profile) return;

    const subscription = subscribeToNotifications(profile.user_id, (payload) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      
      // Show browser notification if permission granted
      if (Notification.permission === 'granted') {
        new Notification(payload.new.title, {
          body: payload.new.message,
          icon: '/favicon.ico',
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [profile, queryClient]);
};