import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  university: string;
  course: string;
  semester: number;
  bio?: string;
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
}

export interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'ppt' | 'video' | 'doc' | 'image';
  subject: string;
  semester: string;
  author: string;
  authorId: string;
  uploadDate: string;
  downloadUrl: string;
  previewUrl?: string;
  thumbnailUrl?: string;
  fileSize: string;
  downloads: number;
  rating: number;
  tags: string[];
  description: string;
  pages?: number;
  duration?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  isFavorite?: boolean;
}

export interface Notification {
  id: string;
  type: 'upload' | 'download' | 'comment' | 'like' | 'follow';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  resourceId?: string;
  userId?: string;
  avatar?: string;
}

export interface Thread {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  authorAvatar?: string;
  course: string;
  topic: string;
  timestamp: string;
  likes: number;
  replies: number;
  isLiked?: boolean;
  tags: string[];
}

export interface Reply {
  id: string;
  threadId: string;
  content: string;
  author: string;
  authorId: string;
  authorAvatar?: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
}

interface AppState {
  // User state
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  
  // Resources state
  resources: Resource[];
  favoriteResources: string[];
  setResources: (resources: Resource[]) => void;
  toggleFavorite: (resourceId: string) => void;
  
  // Notifications state
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  
  // Community state
  threads: Thread[];
  replies: Record<string, Reply[]>;
  setThreads: (threads: Thread[]) => void;
  addThread: (thread: Omit<Thread, 'id'>) => void;
  addReply: (reply: Omit<Reply, 'id'>) => void;
  toggleThreadLike: (threadId: string) => void;
  toggleReplyLike: (replyId: string, threadId: string) => void;
  
  // UI state
  previewResource: Resource | null;
  setPreviewResource: (resource: Resource | null) => void;
  
  // Search state
  searchQuery: string;
  searchFilters: {
    type?: string;
    subject?: string;
    semester?: string;
    difficulty?: string;
  };
  setSearchQuery: (query: string) => void;
  setSearchFilters: (filters: any) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentUser: null,
      resources: [],
      favoriteResources: [],
      notifications: [],
      unreadCount: 0,
      threads: [],
      replies: {},
      previewResource: null,
      searchQuery: '',
      searchFilters: {},

      // Actions
      setCurrentUser: (user) => set({ currentUser: user }),
      
      setResources: (resources) => set({ resources }),
      
      toggleFavorite: (resourceId) => {
        const { favoriteResources } = get();
        const isFavorite = favoriteResources.includes(resourceId);
        
        set({
          favoriteResources: isFavorite
            ? favoriteResources.filter(id => id !== resourceId)
            : [...favoriteResources, resourceId]
        });
      },
      
      addNotification: (notification) => {
        const newNotification = {
          ...notification,
          id: Date.now().toString()
        };
        
        set(state => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1
        }));
      },
      
      markAsRead: (notificationId) => {
        set(state => ({
          notifications: state.notifications.map(n =>
            n.id === notificationId ? { ...n, isRead: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1)
        }));
      },
      
      markAllAsRead: () => {
        set(state => ({
          notifications: state.notifications.map(n => ({ ...n, isRead: true })),
          unreadCount: 0
        }));
      },
      
      setThreads: (threads) => set({ threads }),
      
      addThread: (thread) => {
        const newThread = {
          ...thread,
          id: Date.now().toString(),
          likes: 0,
          replies: 0
        };
        
        set(state => ({
          threads: [newThread, ...state.threads]
        }));
      },
      
      addReply: (reply) => {
        const newReply = {
          ...reply,
          id: Date.now().toString(),
          likes: 0
        };
        
        set(state => ({
          replies: {
            ...state.replies,
            [reply.threadId]: [...(state.replies[reply.threadId] || []), newReply]
          },
          threads: state.threads.map(t =>
            t.id === reply.threadId ? { ...t, replies: t.replies + 1 } : t
          )
        }));
      },
      
      toggleThreadLike: (threadId) => {
        set(state => ({
          threads: state.threads.map(t =>
            t.id === threadId
              ? { ...t, isLiked: !t.isLiked, likes: t.isLiked ? t.likes - 1 : t.likes + 1 }
              : t
          )
        }));
      },
      
      toggleReplyLike: (replyId, threadId) => {
        set(state => ({
          replies: {
            ...state.replies,
            [threadId]: state.replies[threadId]?.map(r =>
              r.id === replyId
                ? { ...r, isLiked: !r.isLiked, likes: r.isLiked ? r.likes - 1 : r.likes + 1 }
                : r
            ) || []
          }
        }));
      },
      
      setPreviewResource: (resource) => set({ previewResource: resource }),
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      setSearchFilters: (filters) => set({ searchFilters: filters })
    }),
    {
      name: 'app-store',
      partialize: (state) => ({
        currentUser: state.currentUser,
        favoriteResources: state.favoriteResources,
        notifications: state.notifications,
        unreadCount: state.unreadCount
      })
    }
  )
);