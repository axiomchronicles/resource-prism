import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  X,
  Download,
  Heart,
  Share2,
  Eye,
  Star,
  Clock,
  FileText,
  User,
  Calendar,
  Tag,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  FileIcon,
  File
} from 'lucide-react';
import { useAppStore, Resource } from '@/stores/appStore';
import { useToast } from '@/hooks/use-toast';

interface QuickPreviewDrawerProps {
  resource: Resource | null;
  isOpen: boolean;
  onClose: () => void;
}

export const QuickPreviewDrawer: React.FC<QuickPreviewDrawerProps> = ({
  resource,
  isOpen,
  onClose
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  
  const { toggleFavorite, favoriteResources, addNotification } = useAppStore();
  const { toast } = useToast();

  const isFavorite = resource ? favoriteResources.includes(resource.id) : false;

  const handleFavorite = () => {
    if (!resource) return;
    
    toggleFavorite(resource.id);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: resource.title
    });
  };

  const handleDownload = () => {
    if (!resource) return;
    
    addNotification({
      type: 'download',
      title: 'Download Started',
      message: `Downloading ${resource.title}`,
      timestamp: new Date().toISOString(),
      isRead: false,
      resourceId: resource.id
    });
    
    toast({
      title: "Download started",
      description: resource.title
    });
  };

  const handleShare = async () => {
    if (!resource) return;
    
    try {
      await navigator.share({
        title: resource.title,
        text: resource.description,
        url: window.location.href
      });
    } catch (error) {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied to clipboard",
        description: "Share this resource with others"
      });
    }
  };

  const renderPreviewContent = () => {
    if (!resource) return null;

    setTimeout(() => setIsLoading(false), 1500);

    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      );
    }

    switch (resource.type) {
      case 'pdf':
        return (
          <div className="space-y-4">
            <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              <div className="aspect-[3/4] bg-white dark:bg-gray-900 p-8 text-center">
                <FileText className="w-24 h-24 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg font-medium mb-2">{resource.title}</p>
                <p className="text-sm text-muted-foreground">PDF Document</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Page {currentPage} of {resource.pages || 1}
                </p>
              </div>
              
              {/* PDF Controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg p-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-white text-sm px-2">
                  {currentPage} / {resource.pages || 1}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => setCurrentPage(Math.min(resource.pages || 1, currentPage + 1))}
                  disabled={currentPage === (resource.pages || 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <div className="w-px h-6 bg-white/20 mx-1" />
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => setZoom(Math.max(50, zoom - 25))}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-white text-sm px-1">{zoom}%</span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => setZoom(Math.min(200, zoom + 25))}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        );

      case 'ppt':
        return (
          <div className="space-y-4">
            <div className="relative bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/20 dark:to-red-900/20 rounded-lg overflow-hidden">
              <div className="aspect-[16/9] p-8 text-center">
                <FileIcon className="w-24 h-24 mx-auto mb-4 text-orange-600" />
                <p className="text-lg font-medium mb-2">{resource.title}</p>
                <p className="text-sm text-muted-foreground">PowerPoint Presentation</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Slide {currentPage} of {resource.pages || 1}
                </p>
              </div>
              
              {/* PPT Controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg p-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-white text-sm px-2">
                  {currentPage} / {resource.pages || 1}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => setCurrentPage(Math.min(resource.pages || 1, currentPage + 1))}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <div className="aspect-video bg-black text-center flex items-center justify-center">
                <div className="text-center">
                  <Play className="w-16 h-16 mx-auto mb-4 text-white" />
                  <p className="text-white text-lg font-medium">{resource.title}</p>
                  <p className="text-gray-300 text-sm">Duration: {resource.duration || '10:30'}</p>
                </div>
              </div>
              
              {/* Video Controls */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-lg p-3">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <div className="flex-1 h-1 bg-white/20 rounded-full">
                  <div className="h-full w-1/3 bg-white rounded-full" />
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                >
                  <Maximize className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div className="bg-muted rounded-lg p-8 text-center">
              <File className="w-24 h-24 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium mb-2">{resource.title}</p>
              <p className="text-sm text-muted-foreground">Document</p>
            </div>
          </div>
        );
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'Hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[90vh]">
        <div className="mx-auto w-full max-w-6xl">
          <DrawerHeader className="border-b">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <DrawerTitle className="text-left text-xl font-bold">
                  {resource?.title}
                </DrawerTitle>
                <DrawerDescription className="text-left mt-2">
                  {resource?.description}
                </DrawerDescription>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleFavorite}
                  className={isFavorite ? 'text-red-500' : ''}
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button onClick={handleDownload} size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <DrawerClose asChild>
                  <Button variant="outline" size="sm">
                    <X className="w-4 h-4" />
                  </Button>
                </DrawerClose>
              </div>
            </div>
          </DrawerHeader>

          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Preview Area */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderPreviewContent()}
                </motion.div>
              </div>

              {/* Details Sidebar */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="space-y-4"
                >
                  {/* Author Info */}
                  <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                    <Avatar>
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${resource?.author}`} />
                      <AvatarFallback>
                        {resource?.author.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{resource?.author}</p>
                      <p className="text-sm text-muted-foreground">Author</p>
                    </div>
                  </div>

                  {/* Resource Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <Eye className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                      <p className="text-lg font-semibold">{resource?.downloads}</p>
                      <p className="text-xs text-muted-foreground">Downloads</p>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <Star className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
                      <p className="text-lg font-semibold">{resource?.rating}</p>
                      <p className="text-xs text-muted-foreground">Rating</p>
                    </div>
                  </div>

                  {/* Resource Details */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Subject:</span>
                      <Badge variant="secondary">{resource?.subject}</Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Semester:</span>
                      <Badge variant="outline">{resource?.semester}</Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Type:</span>
                      <Badge variant="outline" className="uppercase">
                        {resource?.type}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Size:</span>
                      <span className="text-sm">{resource?.fileSize}</span>
                    </div>
                    
                    {resource?.difficulty && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Difficulty:</span>
                        <Badge className={getDifficultyColor(resource.difficulty)}>
                          {resource.difficulty}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {resource?.tags && resource.tags.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Tags</p>
                      <div className="flex flex-wrap gap-1">
                        {resource.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button className="w-full" onClick={handleDownload}>
                      <Download className="w-4 h-4 mr-2" />
                      Download ({resource?.fileSize})
                    </Button>
                    <Button variant="outline" className="w-full" onClick={handleFavorite}>
                      <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current text-red-500' : ''}`} />
                      {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};