import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Resource = Database['public']['Tables']['resources']['Row'];
export type Discussion = Database['public']['Tables']['discussions']['Row'];
export type DiscussionReply = Database['public']['Tables']['discussion_replies']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];
export type UserFavorite = Database['public']['Tables']['user_favorites']['Row'];

// Auth helpers
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

export const getCurrentProfile = async () => {
  const user = await getCurrentUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return profile;
};

// Resources
export const getResources = async (filters?: {
  type?: string;
  subject?: string;
  semester?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) => {
  let query = supabase
    .from('resources')
    .select(`
      *,
      profiles!resources_uploaded_by_fkey(full_name, avatar_url)
    `)
    .eq('is_approved', true)
    .order('created_at', { ascending: false });

  if (filters?.type) {
    query = query.eq('type', filters.type);
  }
  if (filters?.subject) {
    query = query.eq('subject', filters.subject);
  }
  if (filters?.semester) {
    query = query.eq('semester', filters.semester);
  }
  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }
  if (filters?.limit) {
    query = query.limit(filters.limit);
  }
  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }

  return query;
};

export const getFeaturedResources = async () => {
  return supabase
    .from('resources')
    .select(`
      *,
      profiles!resources_uploaded_by_fkey(full_name, avatar_url)
    `)
    .eq('is_featured', true)
    .eq('is_approved', true)
    .order('downloads_count', { ascending: false })
    .limit(6);
};

export const getTrendingResources = async () => {
  return supabase
    .from('resources')
    .select(`
      *,
      profiles!resources_uploaded_by_fkey(full_name, avatar_url)
    `)
    .eq('is_approved', true)
    .order('views_count', { ascending: false })
    .limit(10);
};

export const uploadResource = async (resourceData: {
  title: string;
  description?: string;
  type: Database['public']['Enums']['resource_type'];
  subject: Database['public']['Enums']['subject_type'];
  semester: Database['public']['Enums']['semester_type'];
  file_url: string;
  file_size?: number;
  file_type?: string;
  thumbnail_url?: string;
  tags?: string[];
}) => {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const profile = await getCurrentProfile();
  if (!profile) throw new Error('Profile not found');

  return supabase
    .from('resources')
    .insert({
      ...resourceData,
      uploaded_by: profile.user_id
    })
    .select()
    .single();
};

// Favorites
export const getUserFavorites = async () => {
  const user = await getCurrentUser();
  if (!user) return { data: [], error: null };

  return supabase
    .from('user_favorites')
    .select(`
      *,
      resources(
        *,
        profiles!resources_uploaded_by_fkey(full_name, avatar_url)
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
};

export const toggleFavorite = async (resourceId: string) => {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const profile = await getCurrentProfile();
  if (!profile) throw new Error('Profile not found');

  // Check if already favorited
  const { data: existing } = await supabase
    .from('user_favorites')
    .select('id')
    .eq('user_id', profile.user_id)
    .eq('resource_id', resourceId)
    .single();

  if (existing) {
    // Remove from favorites
    return supabase
      .from('user_favorites')
      .delete()
      .eq('id', existing.id);
  } else {
    // Add to favorites
    return supabase
      .from('user_favorites')
      .insert({
        user_id: profile.user_id,
        resource_id: resourceId
      });
  }
};

// Discussions
export const getDiscussions = async (filters?: {
  subject?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) => {
  let query = supabase
    .from('discussions')
    .select(`
      *,
      profiles!discussions_author_id_fkey(full_name, avatar_url)
    `)
    .order('created_at', { ascending: false });

  if (filters?.subject) {
    query = query.eq('subject', filters.subject);
  }
  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`);
  }
  if (filters?.limit) {
    query = query.limit(filters.limit);
  }
  if (filters?.offset) {
    query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
  }

  return query;
};

export const createDiscussion = async (discussionData: {
  title: string;
  content: string;
  subject?: Database['public']['Enums']['subject_type'];
  tags?: string[];
}) => {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const profile = await getCurrentProfile();
  if (!profile) throw new Error('Profile not found');

  return supabase
    .from('discussions')
    .insert({
      ...discussionData,
      author_id: profile.user_id
    })
    .select()
    .single();
};

export const getDiscussionReplies = async (discussionId: string) => {
  return supabase
    .from('discussion_replies')
    .select(`
      *,
      profiles!discussion_replies_author_id_fkey(full_name, avatar_url)
    `)
    .eq('discussion_id', discussionId)
    .order('created_at', { ascending: true });
};

export const createDiscussionReply = async (replyData: {
  discussion_id: string;
  content: string;
  parent_reply_id?: string;
}) => {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const profile = await getCurrentProfile();
  if (!profile) throw new Error('Profile not found');

  return supabase
    .from('discussion_replies')
    .insert({
      ...replyData,
      author_id: profile.user_id
    })
    .select()
    .single();
};

// Notifications
export const getUserNotifications = async () => {
  const user = await getCurrentUser();
  if (!user) return { data: [], error: null };

  const profile = await getCurrentProfile();
  if (!profile) return { data: [], error: null };

  return supabase
    .from('notifications')
    .select('*')
    .eq('user_id', profile.user_id)
    .order('created_at', { ascending: false });
};

export const markNotificationAsRead = async (notificationId: string) => {
  return supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);
};

export const markAllNotificationsAsRead = async () => {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const profile = await getCurrentProfile();
  if (!profile) throw new Error('Profile not found');

  return supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', profile.user_id)
    .eq('is_read', false);
};

// Analytics
export const incrementViewCount = async (resourceId: string) => {
  const user = await getCurrentUser();
  const profile = user ? await getCurrentProfile() : null;

  // Record the view
  await supabase
    .from('resource_views')
    .insert({
      resource_id: resourceId,
      user_id: profile?.user_id || null
    });

  // Increment the counter using the database function
  return supabase.rpc('increment_view_count', { resource_uuid: resourceId });
};

export const incrementDownloadCount = async (resourceId: string) => {
  const user = await getCurrentUser();
  if (!user) throw new Error('User not authenticated');

  const profile = await getCurrentProfile();
  if (!profile) throw new Error('Profile not found');

  // Record the download
  await supabase
    .from('resource_downloads')
    .insert({
      resource_id: resourceId,
      user_id: profile.user_id
    });

  // Increment the counter using the database function
  return supabase.rpc('increment_download_count', { resource_uuid: resourceId });
};

// File upload
export const uploadFile = async (file: File, bucket: string = 'resources') => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${bucket}/${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return { path: data.path, url: publicUrl };
};

// Real-time subscriptions
export const subscribeToResourceUpdates = (callback: (payload: any) => void) => {
  return supabase
    .channel('resources')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'resources' }, 
      callback
    )
    .subscribe();
};

export const subscribeToNotifications = (userId: string, callback: (payload: any) => void) => {
  return supabase
    .channel('notifications')
    .on('postgres_changes', 
      { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      }, 
      callback
    )
    .subscribe();
};

export const subscribeToDiscussions = (callback: (payload: any) => void) => {
  return supabase
    .channel('discussions')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'discussions' }, 
      callback
    )
    .subscribe();
};