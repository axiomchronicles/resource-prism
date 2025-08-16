import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Bookmark, 
  Download, 
  Eye, 
  Star, 
  Heart,
  Trash2,
  Grid3X3,
  List,
  Search,
  Filter,
  FolderPlus,
  Folder,
  Calendar,
  SortAsc
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUserFavorites, useToggleFavorite } from "@/hooks/useResources";
import { useAuth } from "@/hooks/useAuth";
import { AuthGuard } from "@/components/AuthGuard";
import { Skeleton } from "@/components/ui/skeleton";



export default function MyLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("saved_date");
  const [selectedFolder, setSelectedFolder] = useState("All");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedResources, setSelectedResources] = useState<number[]>([]);
  const [newFolderName, setNewFolderName] = useState("");

  const { data: favoritesData, isLoading } = useUserFavorites();
  const toggleFavoriteMutation = useToggleFavorite();
  
  const favorites = favoritesData?.data || [];
  const savedResources = favorites.map(fav => fav.resources).filter(Boolean);
  
  const folders = [
    { name: "All", count: savedResources.length },
    { name: "Notes", count: savedResources.filter(r => r.type === 'notes').length },
    { name: "PPTs", count: savedResources.filter(r => r.type === 'ppt').length },
    { name: "Past Papers", count: savedResources.filter(r => r.type === 'past_paper').length },
    { name: "Tutorials", count: savedResources.filter(r => r.type === 'tutorial').length },
  ];
  const toggleResourceSelection = (resourceId: number) => {
    setSelectedResources(prev => 
      prev.includes(resourceId) 
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  const selectAllResources = () => {
    if (selectedResources.length === savedResources.length) {
      setSelectedResources([]);
    } else {
      setSelectedResources(savedResources.map(resource => parseInt(resource.id)));
    }
  };

  const filteredResources = savedResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (resource.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFolder = selectedFolder === "All" || 
      (selectedFolder === "Notes" && resource.type === 'notes') ||
      (selectedFolder === "PPTs" && resource.type === 'ppt') ||
      (selectedFolder === "Past Papers" && resource.type === 'past_paper') ||
      (selectedFolder === "Tutorials" && resource.type === 'tutorial');
    const matchesType = selectedType === "all" || resource.type === selectedType;
    
    return matchesSearch && matchesFolder && matchesType;
  });

  const removeFromLibrary = (resourceId: number) => {
    toggleFavoriteMutation.mutate(resourceId.toString());
  };

  return (
    <AuthGuard requireAuth>
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            My Library
          </h1>
          <p className="text-xl text-muted-foreground">
            Your saved resources and collections
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full lg:w-64 shrink-0"
          >
            <Card className="p-6 glass border-white/20 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold">Folders</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <FolderPlus className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Folder</DialogTitle>
                      <DialogDescription>
                        Organize your saved resources into folders
                      </DialogDescription>
                    </DialogHeader>
                    <Input
                      placeholder="Folder name"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                    />
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setNewFolderName("")}>
                        Cancel
                      </Button>
                      <Button onClick={() => {
                        // Handle folder creation
                        setNewFolderName("");
                      }}>
                        Create Folder
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="space-y-2">
                {folders.map(folder => (
                  <Button
                    key={folder.name}
                    variant={selectedFolder === folder.name ? "default" : "ghost"}
                    className="w-full justify-between"
                    onClick={() => setSelectedFolder(folder.name)}
                  >
                    <span className="flex items-center gap-2">
                      <Folder className="w-4 h-4" />
                      {folder.name}
                    </span>
                    <Badge variant="secondary">{folder.count}</Badge>
                  </Button>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search your library..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="notes">Notes</SelectItem>
                      <SelectItem value="ppt">PPTs</SelectItem>
                      <SelectItem value="paper">Papers</SelectItem>
                      <SelectItem value="tutorial">Tutorials</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="saved_date">Date Saved</SelectItem>
                      <SelectItem value="title">Title</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="downloads">Downloads</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Selection Controls */}
              {filteredResources.length > 0 && (
                <div className="flex items-center justify-between p-4 glass rounded-2xl border border-white/20">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={selectAllResources}
                    >
                      {selectedResources.length === filteredResources.length ? "Deselect All" : "Select All"}
                    </Button>
                    {selectedResources.length > 0 && (
                      <span className="text-sm text-muted-foreground">
                        {selectedResources.length} selected
                      </span>
                    )}
                  </div>
                  
                  {selectedResources.length > 0 && (
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Folder className="w-4 h-4" />
                        Move to Folder
                      </Button>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4" />
                        Remove Selected
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Results Count */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <p className="text-muted-foreground">
               {isLoading ? 'Loading...' : `${filteredResources.length} resources in ${selectedFolder === "All" ? "library" : selectedFolder}`}
              </p>
            </motion.div>

            {/* Resources Grid/List */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${viewMode}-${selectedFolder}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={
                  viewMode === "grid" 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, index) => (
                    <Card key={index} className="glass border-white/20 p-6">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <Skeleton className="h-16 w-full mb-4" />
                      <div className="flex gap-2">
                        <Skeleton className="h-8 flex-1" />
                        <Skeleton className="h-8 flex-1" />
                      </div>
                    </Card>
                  ))
                ) : (
                  filteredResources.map((resource, index) => (
                  <motion.div
                    key={resource.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card className={`glass border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-medium overflow-hidden ${
                      viewMode === "list" ? "flex" : ""
                    } ${
                      selectedResources.includes(parseInt(resource.id)) ? "ring-2 ring-primary" : ""
                    }`}>
                      {viewMode === "grid" ? (
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={selectedResources.includes(parseInt(resource.id))}
                                onChange={() => toggleResourceSelection(parseInt(resource.id))}
                                className="rounded border-gray-300"
                              />
                              <div className="flex-1">
                                <h3 className="font-bold text-lg mb-2 line-clamp-2">
                                  {resource.title}
                                </h3>
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge variant="secondary">{resource.type}</Badge>
                                  <Badge variant="outline">{resource.semester} Sem</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  by {resource.profiles?.full_name || 'Unknown'}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFromLibrary(parseInt(resource.id))}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-4">
                            {(resource.tags || []).slice(0, 3).map(tag => (
                              <span key={tag} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
                                #{tag}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                            <span className="flex items-center gap-1">
                              <Download className="w-4 h-4" />
                              {resource.downloads_count}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              {resource.rating}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(resource.created_at).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Eye className="w-4 h-4" />
                              View
                            </Button>
                            <Button variant="default" size="sm" className="flex-1">
                              <Download className="w-4 h-4" />
                              Download
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex w-full p-6">
                          <div className="flex items-center gap-4 flex-1">
                            <input
                              type="checkbox"
                              checked={selectedResources.includes(parseInt(resource.id))}
                              onChange={() => toggleResourceSelection(parseInt(resource.id))}
                              className="rounded border-gray-300"
                            />
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-bold text-lg mb-1">{resource.title}</h3>
                                  <div className="flex items-center gap-2 mb-1">
                                    <Badge variant="secondary">{resource.type}</Badge>
                                    <Badge variant="outline">{resource.semester} Sem</Badge>
                                    <span className="text-sm text-muted-foreground">by {resource.profiles?.full_name || 'Unknown'}</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    Saved • {new Date(resource.created_at).toLocaleDateString()}
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeFromLibrary(parseInt(resource.id))}
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Download className="w-4 h-4" />
                                    {resource.downloads_count}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    {resource.rating}
                                  </span>
                                </div>

                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm">
                                    <Eye className="w-4 h-4" />
                                    View
                                  </Button>
                                  <Button variant="default" size="sm">
                                    <Download className="w-4 h-4" />
                                    Download
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                  ))
                )}
              </motion.div>
            </AnimatePresence>

            {!isLoading && filteredResources.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <Bookmark className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No saved resources</h3>
                <p className="text-muted-foreground mb-6">
                  {selectedFolder === "All" 
                    ? "Start saving resources to build your personal library"
                    : `No resources found in ${selectedFolder}`
                  }
                </p>
                <Button variant="hero">
                  Browse Resources
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}