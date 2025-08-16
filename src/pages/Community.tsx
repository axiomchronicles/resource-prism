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
import { useAppStore } from '@/stores/appStore';
import { useToast } from '@/hooks/use-toast';
import { useDiscussions, useCreateDiscussion, useDiscussionReplies, useCreateReply, useDiscussionSubscription } from '@/hooks/useDiscussions';
import { useAuth } from '@/hooks/useAuth';


export default function Community() {
  const [activeTab, setActiveTab] = useState('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [showNewThreadDialog, setShowNewThreadDialog] = useState(false);
  const [expandedThread, setExpandedThread] = useState<string | null>(null);
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadContent, setNewThreadContent] = useState('');
  const [newThreadTags, setNewThreadTags] = useState('');
  const [newThreadSubject, setNewThreadSubject] = useState('');
  const [replyContent, setReplyContent] = useState<Record<string, string>>({});

  const { isAuthenticated, profile } = useAuth();
  const { toast } = useToast();
  const { ref: loadMoreRef, inView } = useInView();

  const { data: discussionsData, isLoading } = useDiscussions({
    subject: selectedSubject || undefined,
    search: searchQuery || undefined,
    limit: 20
  });
  
  const createDiscussionMutation = useCreateDiscussion();
  const createReplyMutation = useCreateReply();
  
  // Subscribe to real-time updates
  useDiscussionSubscription();
  
  const discussions = discussionsData?.data || [];


  const handleCreateThread = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/community');
      return;
    }
    
    if (!newThreadTitle.trim() || !newThreadContent.trim() || !newThreadSubject) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    createDiscussionMutation.mutate({
      title: newThreadTitle,
      content: newThreadContent,
      subject: newThreadSubject as any,
      tags: newThreadTags.split(',').map(tag => tag.trim()).filter(Boolean)
    }, {
      onSuccess: () => {
        setNewThreadTitle('');
        setNewThreadContent('');
        setNewThreadTags('');
        setNewThreadSubject('');
        setShowNewThreadDialog(false);
      }
    });
  };

  const handleReply = (threadId: string) => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/community');
      return;
    }
    
    const content = replyContent[threadId]?.trim();
    if (!content) return;

    createReplyMutation.mutate({
      discussion_id: threadId,
      content,
    }, {
      onSuccess: () => {
        setReplyContent(prev => ({ ...prev, [threadId]: '' }));
      }
    });
  };

  const ThreadCard = ({ thread }: { thread: any }) => {
    const { data: repliesData } = useDiscussionReplies(thread.id);
    const replies = repliesData?.data || [];
    
    return (
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
                <AvatarImage src={thread.profiles?.avatar_url} />
                <AvatarFallback>{(thread.profiles?.full_name || 'U').split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{thread.profiles?.full_name || 'Anonymous'}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="w-3 h-3" />
                  <span>{thread.subject}</span>
                  <span>•</span>
                  <Clock className="w-3 h-3" />
                  <span>{new Date(thread.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <Badge variant="outline">{thread.subject}</Badge>
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

          {thread.tags && thread.tags.length > 0 && (
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
                className="text-muted-foreground"
              >
                <Heart className="w-4 h-4 mr-1" />
                {thread.likes_count || 0}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandedThread(expandedThread === thread.id ? null : thread.id)}
              >
                <MessageSquare className="w-4 h-4 mr-1" />
                {thread.replies_count || 0}
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
                  {replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={reply.profiles?.avatar_url} />
                        <AvatarFallback className="text-xs">
                          {(reply.profiles?.full_name || 'U').split(' ').map((n: string) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">{reply.profiles?.full_name || 'Anonymous'}</span>
                          <span className="text-muted-foreground">{new Date(reply.created_at).toLocaleDateString()}</span>
                        </div>
                        <p className="text-sm">{reply.content}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-auto p-1 text-muted-foreground"
                        >
                          <ThumbsUp className="w-3 h-3 mr-1" />
                          {reply.likes_count || 0}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Input */}
                <div className="flex gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback className="text-xs">
                      {profile?.full_name?.split(' ').map(n => n[0]).join('') || 'U'}
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
  };

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
                <SelectItem value="">All Subjects</SelectItem>
                <SelectItem value="programming">Programming</SelectItem>
                <SelectItem value="mathematics">Mathematics</SelectItem>
                <SelectItem value="database">Database</SelectItem>
                <SelectItem value="ai_ml">AI & ML</SelectItem>
                <SelectItem value="web_development">Web Development</SelectItem>
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
                <Select value={newThreadSubject} onValueChange={setNewThreadSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="programming">Programming</SelectItem>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                    <SelectItem value="database">Database</SelectItem>
                    <SelectItem value="ai_ml">AI & ML</SelectItem>
                    <SelectItem value="web_development">Web Development</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
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
                  {discussions.map(thread => (
                    <ThreadCard key={thread.id} thread={thread} />
                  ))}
                  
                  {!isLoading && discussions.length === 0 && (
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