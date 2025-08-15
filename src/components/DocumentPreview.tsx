import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Download, 
  Heart, 
  Share2, 
  ZoomIn, 
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  FileText,
  Presentation,
  Video,
  Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Document {
  id: string;
  title: string;
  type: "pdf" | "ppt" | "video" | "image";
  pages?: number;
  duration?: string;
  fileSize: string;
  downloadUrl: string;
  author: string;
  subject: string;
  tags: string[];
  description: string;
  rating: number;
  downloads: number;
  uploadDate: string;
}

interface DocumentPreviewProps {
  document: Document;
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentPreview = ({ document, isOpen, onClose }: DocumentPreviewProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [isFavorite, setIsFavorite] = useState(false);

  const getFileIcon = (type: string) => {
    switch (type) {
      case "pdf": return <FileText className="w-5 h-5" />;
      case "ppt": return <Presentation className="w-5 h-5" />;
      case "video": return <Video className="w-5 h-5" />;
      case "image": return <ImageIcon className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const renderPreviewContent = () => {
    switch (document.type) {
      case "pdf":
        return (
          <div className="bg-white rounded-lg shadow-lg p-8 min-h-[600px] flex items-center justify-center">
            <div className="text-center">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">PDF Preview</p>
              <p className="text-sm text-gray-500 mt-2">
                Page {currentPage} of {document.pages}
              </p>
            </div>
          </div>
        );
      case "ppt":
        return (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-lg p-8 min-h-[600px] flex items-center justify-center">
            <div className="text-center">
              <Presentation className="w-16 h-16 mx-auto mb-4 text-blue-500" />
              <p className="text-gray-700">Presentation Preview</p>
              <p className="text-sm text-gray-500 mt-2">
                Slide {currentPage} of {document.pages}
              </p>
            </div>
          </div>
        );
      case "video":
        return (
          <div className="bg-black rounded-lg shadow-lg min-h-[600px] flex items-center justify-center">
            <div className="text-center text-white">
              <Video className="w-16 h-16 mx-auto mb-4" />
              <p>Video Preview</p>
              <p className="text-sm text-gray-300 mt-2">
                Duration: {document.duration}
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-gray-100 rounded-lg shadow-lg p-8 min-h-[600px] flex items-center justify-center">
            <div className="text-center">
              {getFileIcon(document.type)}
              <p className="text-gray-600 mt-2">File Preview</p>
            </div>
          </div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-7xl max-h-[90vh] bg-background rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b glass">
              <div className="flex items-center gap-3">
                {getFileIcon(document.type)}
                <div>
                  <h2 className="text-xl font-bold">{document.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    by {document.author} • {document.subject}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => setIsFavorite(!isFavorite)}>
                  <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Share2 className="w-5 h-5" />
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="flex h-[calc(90vh-80px)]">
              {/* Preview Area */}
              <div className="flex-1 flex flex-col">
                {/* Toolbar */}
                {(document.type === "pdf" || document.type === "ppt") && (
                  <div className="flex items-center justify-between p-4 border-b bg-muted/30">
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        disabled={currentPage <= 1}
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <span className="text-sm font-medium px-3">
                        {currentPage} / {document.pages}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        disabled={currentPage >= (document.pages || 1)}
                        onClick={() => setCurrentPage(Math.min(document.pages || 1, currentPage + 1))}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setZoom(Math.max(50, zoom - 25))}
                      >
                        <ZoomOut className="w-4 h-4" />
                      </Button>
                      <span className="text-sm font-medium px-3">{zoom}%</span>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => setZoom(Math.min(200, zoom + 25))}
                      >
                        <ZoomIn className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Content */}
                <ScrollArea className="flex-1 p-6">
                  <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top left" }}>
                    {renderPreviewContent()}
                  </div>
                </ScrollArea>
              </div>

              {/* Sidebar */}
              <div className="w-80 border-l bg-muted/30">
                <ScrollArea className="h-full p-6">
                  <div className="space-y-6">
                    {/* Document Info */}
                    <Card className="p-4">
                      <h3 className="font-semibold mb-3">Document Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <Badge variant="secondary">{document.type.toUpperCase()}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Size:</span>
                          <span>{document.fileSize}</span>
                        </div>
                        {document.pages && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Pages:</span>
                            <span>{document.pages}</span>
                          </div>
                        )}
                        {document.duration && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Duration:</span>
                            <span>{document.duration}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Downloads:</span>
                          <span>{document.downloads}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Rating:</span>
                          <span>⭐ {document.rating}</span>
                        </div>
                      </div>
                    </Card>

                    {/* Description */}
                    <Card className="p-4">
                      <h3 className="font-semibold mb-3">Description</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {document.description}
                      </p>
                    </Card>

                    {/* Tags */}
                    <Card className="p-4">
                      <h3 className="font-semibold mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {document.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </Card>

                    {/* Actions */}
                    <div className="space-y-2">
                      <Button className="w-full" size="lg">
                        <Download className="w-4 h-4 mr-2" />
                        Download ({document.fileSize})
                      </Button>
                      <Button variant="outline" className="w-full">
                        <Heart className="w-4 h-4 mr-2" />
                        Add to Library
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};