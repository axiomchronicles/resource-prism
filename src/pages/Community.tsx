import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  MessageSquare,
  Plus,
  Search,
  Filter,
  Heart,
  Reply,
  Send,
  TrendingUp,
  Clock,
  User,
  BookOpen,
  Hash,
  ChevronDown,
  ThumbsUp,
  Share2,
  Bookmark
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppStore, Thread, Reply as ReplyType } from '@/stores/appStore';
import { useToast } from '@/hooks/use-toast';

const mockThreads: Thread[] = [
  {
    id: '1',
    title: 'Best resources for Data Structures and Algorithms?',
    content: 'Hi everyone! I\'m looking for comprehensive resources to study DSA. Can anyone recommend good books, videos, or practice platforms?',
    author: 'Alex Kumar',
    authorId: '1',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    course: 'Computer Science',
    topic: 'Data Structures',
    timestamp: '2 hours ago',
    likes: 24,
    replies: 12,
    isLiked: false,
    tags: ['DSA', 'Study Tips', 'Programming']
  },
  {
    id: '2',
    title: 'Physics formulas cheat sheet',
    content: 'Created a comprehensive physics formulas cheat sheet for semester 3. Covers mechanics, thermodynamics, and waves. Hope it helps!',
    author: 'Priya Singh',
    authorId: '2',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
    course: 'Physics',
    topic: 'Study Materials',
    timestamp: '5 hours ago',
    likes: 45,
    replies: 8,
    isLiked: true,
    tags: ['Physics', 'Formulas', 'Cheat Sheet']
  },
  {
    id: '3',
    title: 'Group study for upcoming exams?',
    content: 'Anyone interested in forming a study group for the upcoming mid-semester exams? We can meet online and cover topics together.',
    author: 'Rahul Sharma',
    authorId: '3',
    authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rahul',
    course: 'Engineering',
    topic: 'Study Groups',
    timestamp: '1 day ago',
    likes: 18,
    replies: 25,
    isLiked: false,
    tags: ['Study Group', 'Exams', 'Collaboration']
  }
];

const mockReplies: Record<string, ReplyType[]> = {
  '1': [
    {
      id: '1-1',
      threadId: '1',
      content: 'I highly recommend "Introduction to Algorithms" by CLRS. It\'s comprehensive and well-explained.',
      author: 'Sarah Wilson',
      authorId: '4',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      timestamp: '1 hour ago',
      likes: 8,
      isLiked: false
    },
    {
      id: '1-2',
      threadId: '1',
      content: 'For practice, LeetCode and GeeksforGeeks are excellent platforms. Start with easy problems and gradually move to harder ones.',
      author: 'Mike Chen',
      authorId: '5',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
      timestamp: '30 minutes ago',
      likes: 12,
      isLiked: true
    }
  ]
};

export default function Community() {
  const [activeTab, setActiveTab] = useState('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [showNewThreadDialog, setShowNewThreadDialog] = useState(false);
  const [expandedThread, setExpandedThread] = useState<string | null>(null);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadContent, setNewThreadContent] = useState('');
  const [newThreadTags, setNewThreadTags] = useState('');
  const [replyContent, setReplyContent] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  const { threads, replies, setThreads, addThread, addReply, toggleThreadLike, toggleReplyLike, currentUser } = useAppStore();
  const { toast } = useToast();
  const { ref: loadMoreRef, inView } = useInView();

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setThreads(mockThreads);
      setIsLoading(false);
    }, 1000);
  }, [setThreads]);

  const filteredThreads = threads.filter(thread => {
    const matchesSearch = thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         thread.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = !selectedCourse || thread.course === selectedCourse;
    const matchesTopic = !selectedTopic || thread.topic === selectedTopic;
    
    return matchesSearch && matchesCourse && matchesTopic;
  });

  const handleCreateThread = () => {
    if (!newThreadTitle.trim() || !newThreadContent.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newThread: Omit<Thread, 'id'> = {
      title: newThreadTitle,
      content: newThreadContent,
      author: currentUser?.name || 'Anonymous',
      authorId: currentUser?.id || 'anonymous',
      authorAvatar: currentUser?.avatar,
      course: currentUser?.course || 'General',
      topic: 'Discussion',
      timestamp: 'Just now',
      likes: 0,
      replies: 0,
      isLiked: false,
      tags: newThreadTags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    addThread(newThread);
    setNewThreadTitle('');
    setNewThreadContent('');
    setNewThreadTags('');
    setShowNewThreadDialog(false);

    toast({
      title: "Thread created!",
      description: "Your discussion thread has been posted."
    });
  };

  const handleReply = (threadId: string) => {
    const content = replyContent[threadId]?.trim();
    if (!content) return;

    const newReply: Omit<ReplyType, 'id'> = {
      threadId,
      content,
      author: currentUser?.name || 'Anonymous',
      authorId: currentUser?.id || 'anonymous',
      authorAvatar: currentUser?.avatar,
      timestamp: 'Just now',
      likes: 0,
      isLiked: false
    };

    addReply(newReply);
    setReplyContent(prev => ({ ...prev, [threadId]: '' }));

    toast({
      title: "Reply posted!",
      description: "Your reply has been added to the discussion."
    });
  };

  const ThreadCard = ({ thread }: { thread: Thread }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={thread.authorAvatar} />
                <AvatarFallback>{thread.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{thread.author}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="w-3 h-3" />
                  <span>{thread.course}</span>
                  <span>•</span>
                  <Clock className="w-3 h-3" />
                  <span>{thread.timestamp}</span>
                </div>
              </div>
            </div>
            <Badge variant="outline">{thread.topic}</Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2 cursor-pointer hover:text-primary"
                onClick={() => setExpandedThread(expandedThread === thread.id ? null : thread.id)}>
              {thread.title}
            </h3>
            <p className="text-muted-foreground line-clamp-2">{thread.content}</p>
          </div>

          {thread.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {thread.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  <Hash className="w-2 h-2 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleThreadLike(thread.id)}
                className={thread.isLiked ? 'text-red-500' : ''}
              >
                <Heart className={`w-4 h-4 mr-1 ${thread.isLiked ? 'fill-current' : ''}`} />
                {thread.likes}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandedThread(expandedThread === thread.id ? null : thread.id)}
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                {thread.replies}
              </Button>
              
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpandedThread(expandedThread === thread.id ? null : thread.id)}
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${
                expandedThread === thread.id ? 'rotate-180' : ''
              }`} />
            </Button>
          </div>

          <AnimatePresence>
            {expandedThread === thread.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t pt-4 space-y-4"
              >
                {/* Replies */}
                <div className="space-y-3">
                  {(replies[thread.id] || mockReplies[thread.id] || []).map((reply) => (
                    <div key={reply.id} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={reply.authorAvatar} />
                        <AvatarFallback className="text-xs">
                          {reply.author.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">{reply.author}</span>
                          <span className="text-muted-foreground">{reply.timestamp}</span>
                        </div>
                        <p className="text-sm">{reply.content}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleReplyLike(reply.id, thread.id)}
                          className={`h-auto p-1 ${reply.isLiked ? 'text-red-500' : ''}`}
                        >
                          <ThumbsUp className={`w-3 h-3 mr-1 ${reply.isLiked ? 'fill-current' : ''}`} />
                          {reply.likes}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Input */}
                <div className="flex gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={currentUser?.avatar} />
                    <AvatarFallback className="text-xs">
                      {currentUser?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex gap-2">
                    <Input
                      placeholder="Write a reply..."
                      value={replyContent[thread.id] || ''}
                      onChange={(e) => setReplyContent(prev => ({
                        ...prev,
                        [thread.id]: e.target.value
                      }))}
                      onKeyPress={(e) => e.key === 'Enter' && handleReply(thread.id)}
                    />
                    <Button
                      size="sm"
                      onClick={() => handleReply(thread.id)}
                      disabled={!replyContent[thread.id]?.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-4" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16" />
              <Skeleton className="h-6 w-16" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
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
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Community Discussions</h1>
          <p className="text-muted-foreground">
            Connect with fellow students, share knowledge, and get help with your studies
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex-1 flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search discussions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Courses</SelectItem>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Dialog open={showNewThreadDialog} onOpenChange={setShowNewThreadDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Discussion
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Start a New Discussion</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Discussion title"
                  value={newThreadTitle}
                  onChange={(e) => setNewThreadTitle(e.target.value)}
                />
                <Textarea
                  placeholder="What would you like to discuss?"
                  value={newThreadContent}
                  onChange={(e) => setNewThreadContent(e.target.value)}
                  rows={4}
                />
                <Input
                  placeholder="Tags (comma separated)"
                  value={newThreadTags}
                  onChange={(e) => setNewThreadTags(e.target.value)}
                />
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowNewThreadDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateThread}>
                    Create Discussion
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trending">
              <TrendingUp className="w-4 h-4 mr-2" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="recent">
              <Clock className="w-4 h-4 mr-2" />
              Recent
            </TabsTrigger>
            <TabsTrigger value="unanswered">
              <MessageSquare className="w-4 h-4 mr-2" />
              Unanswered
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {isLoading ? (
              <LoadingSkeleton />
            ) : (
              <AnimatePresence mode="wait">
                <div className="space-y-4">
                  {filteredThreads.map(thread => (
                    <ThreadCard key={thread.id} thread={thread} />
                  ))}
                  
                  {filteredThreads.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12"
                    >
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-medium mb-2">No discussions found</h3>
                      <p className="text-muted-foreground mb-4">
                        Be the first to start a discussion!
                      </p>
                      <Button onClick={() => setShowNewThreadDialog(true)}>
                        Start Discussion
                      </Button>
                    </motion.div>
                  )}
                </div>
              </AnimatePresence>
            )}
          </TabsContent>
        </Tabs>

        {/* Load More */}
        <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
          {inView && !isLoading && (
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