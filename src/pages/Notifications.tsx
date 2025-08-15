import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Bell,
  Download,
  Upload,
  MessageSquare,
  Heart,
  UserPlus,
  Check,
  CheckCheck,
  Trash2,
  Filter,
  Settings,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { useAppStore, Notification } from '@/stores/appStore';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'upload',
    title: 'New upload from Alex Kumar',
    message: 'Data Structures Notes - Chapter 5: Trees and Graphs',
    timestamp: '2 minutes ago',
    isRead: false,
    resourceId: 'res1',
    userId: 'user1',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex'
  },
  {
    id: '2',
    type: 'download',
    title: 'Download completed',
    message: 'Physics Formulas Cheat Sheet.pdf has been downloaded',
    timestamp: '15 minutes ago',
    isRead: false,
    resourceId: 'res2'
  },
  {
    id: '3',
    type: 'comment',
    title: 'New comment on your post',
    message: 'Sarah Wilson commented on "Best DSA Resources"',
    timestamp: '1 hour ago',
    isRead: false,
    userId: 'user2',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah'
  },
  {
    id: '4',
    type: 'like',
    title: 'Your post was liked',
    message: 'Mike Chen liked your discussion "Study Group Formation"',
    timestamp: '2 hours ago',
    isRead: true,
    userId: 'user3',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike'
  },
  {
    id: '5',
    type: 'follow',
    title: 'New follower',
    message: 'Priya Singh started following you',
    timestamp: '3 hours ago',
    isRead: true,
    userId: 'user4',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya'
  },
  {
    id: '6',
    type: 'upload',
    title: 'New upload in Computer Science',
    message: 'Operating Systems Lab Manual - Complete Guide',
    timestamp: '5 hours ago',
    isRead: true,
    resourceId: 'res3',
    userId: 'user5',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john'
  }
];

export default function Notifications() {
  const [filter, setFilter] = useState('all');
  const [showSettings, setShowSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    uploads: true,
    downloads: true,
    comments: true,
    likes: true,
    follows: true,
    browserNotifications: true,
    emailNotifications: false,
    soundEnabled: true
  });

  const { notifications, unreadCount, markAsRead, markAllAsRead, addNotification } = useAppStore();
  const { toast } = useToast();
  const { ref: loadMoreRef, inView } = useInView();

  useEffect(() => {
    // Simulate real-time notifications
    const interval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance every 10 seconds
        const types = ['upload', 'download', 'comment', 'like', 'follow'] as const;
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        const newNotification: Omit<Notification, 'id'> = {
          type: randomType,
          title: getNotificationTitle(randomType),
          message: getNotificationMessage(randomType),
          timestamp: 'Just now',
          isRead: false,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Math.random()}`
        };

        addNotification(newNotification);
        
        // Show toast notification
        if (notificationSettings.soundEnabled) {
          sonnerToast(newNotification.title, {
            description: newNotification.message,
            icon: getNotificationIcon(randomType),
            action: {
              label: 'View',
              onClick: () => markAsRead(newNotification.timestamp)
            }
          });
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [addNotification, markAsRead, notificationSettings.soundEnabled]);

  const getNotificationTitle = (type: string) => {
    switch (type) {
      case 'upload': return 'New upload available';
      case 'download': return 'Download completed';
      case 'comment': return 'New comment';
      case 'like': return 'Your post was liked';
      case 'follow': return 'New follower';
      default: return 'Notification';
    }
  };

  const getNotificationMessage = (type: string) => {
    switch (type) {
      case 'upload': return 'Advanced Mathematics Notes uploaded';
      case 'download': return 'Chemistry Lab Manual.pdf downloaded';
      case 'comment': return 'Someone commented on your discussion';
      case 'like': return 'Your resource received a like';
      case 'follow': return 'A new user started following you';
      default: return 'You have a new notification';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'upload': return <Upload className="w-4 h-4" />;
      case 'download': return <Download className="w-4 h-4" />;
      case 'comment': return <MessageSquare className="w-4 h-4" />;
      case 'like': return <Heart className="w-4 h-4" />;
      case 'follow': return <UserPlus className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'upload': return 'text-blue-500';
      case 'download': return 'text-green-500';
      case 'comment': return 'text-purple-500';
      case 'like': return 'text-red-500';
      case 'follow': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const allNotifications = notifications.length > 0 ? notifications : mockNotifications;
  
  const filteredNotifications = allNotifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.isRead;
    return notification.type === filter;
  });

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId);
    toast({
      title: "Marked as read",
      description: "Notification has been marked as read"
    });
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    toast({
      title: "All notifications marked as read",
      description: `${unreadCount} notifications marked as read`
    });
  };

  const NotificationCard = ({ notification }: { notification: Notification }) => (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        !notification.isRead ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800' : ''
      }`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className={`p-2 rounded-full bg-muted ${getNotificationColor(notification.type)}`}>
              {getNotificationIcon(notification.type)}
            </div>

            {/* Avatar (if user notification) */}
            {notification.avatar && (
              <Avatar className="w-8 h-8">
                <AvatarImage src={notification.avatar} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className={`font-medium ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {notification.title}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                    {!notification.isRead && (
                      <Badge variant="secondary" className="text-xs">New</Badge>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  {!notification.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notification.id);
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Bell className="w-8 h-8" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </h1>
            <p className="text-muted-foreground mt-1">
              Stay updated with uploads, downloads, and community activity
            </p>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="outline" onClick={handleMarkAllAsRead}>
                <CheckCheck className="w-4 h-4 mr-2" />
                Mark all as read
              </Button>
            )}
            
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Notification Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Notification Types</h4>
                    <div className="space-y-3">
                      {Object.entries(notificationSettings).slice(0, 5).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <Label htmlFor={key} className="capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </Label>
                          <Switch
                            id={key}
                            checked={value}
                            onCheckedChange={(checked) =>
                              setNotificationSettings(prev => ({ ...prev, [key]: checked }))
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium mb-3">Delivery Settings</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="browserNotifications">Browser Notifications</Label>
                        <Switch
                          id="browserNotifications"
                          checked={notificationSettings.browserNotifications}
                          onCheckedChange={(checked) =>
                            setNotificationSettings(prev => ({ ...prev, browserNotifications: checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="emailNotifications">Email Notifications</Label>
                        <Switch
                          id="emailNotifications"
                          checked={notificationSettings.emailNotifications}
                          onCheckedChange={(checked) =>
                            setNotificationSettings(prev => ({ ...prev, emailNotifications: checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="soundEnabled">Sound Notifications</Label>
                        <Switch
                          id="soundEnabled"
                          checked={notificationSettings.soundEnabled}
                          onCheckedChange={(checked) =>
                            setNotificationSettings(prev => ({ ...prev, soundEnabled: checked }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter notifications" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Notifications</SelectItem>
              <SelectItem value="unread">Unread Only</SelectItem>
              <SelectItem value="upload">Uploads</SelectItem>
              <SelectItem value="download">Downloads</SelectItem>
              <SelectItem value="comment">Comments</SelectItem>
              <SelectItem value="like">Likes</SelectItem>
              <SelectItem value="follow">Follows</SelectItem>
            </SelectContent>
          </Select>

          <div className="text-sm text-muted-foreground">
            {filteredNotifications.length} notifications
          </div>
        </div>

        {/* Notifications List */}
        <AnimatePresence mode="wait">
          {filteredNotifications.length > 0 ? (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No notifications</h3>
              <p className="text-muted-foreground">
                {filter === 'all' 
                  ? "You're all caught up! New notifications will appear here."
                  : `No ${filter} notifications found.`
                }
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Load More */}
        <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
          {inView && filteredNotifications.length > 0 && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}