import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Presentation, 
  Download, 
  Eye, 
  Star, 
  Heart,
  Play,
  Grid3X3,
  List,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchBar } from "@/components/SearchBar";

const mockPPTs = [
  {
    id: 1,
    title: "Introduction to Machine Learning",
    subject: "Computer Science",
    semester: "6th",
    course: "CS601",
    author: "Dr. Sarah Wilson",
    downloads: 2140,
    rating: 4.9,
    slides: 45,
    tags: ["ml", "python", "algorithms", "ai"],
    uploadDate: "2024-01-20",
    preview: "Comprehensive introduction to ML concepts, algorithms, and practical applications.",
    thumbnail: "/api/placeholder/400/300",
    duration: "2h 30m"
  },
  {
    id: 2,
    title: "Database Design Principles",
    subject: "Computer Science",
    semester: "4th",
    course: "CS401",
    author: "Prof. Mike Johnson",
    downloads: 1890,
    rating: 4.8,
    slides: 38,
    tags: ["database", "sql", "normalization", "design"],
    uploadDate: "2024-01-18",
    preview: "Essential database design concepts, normalization forms, and best practices.",
    thumbnail: "/api/placeholder/400/300",
    duration: "1h 45m"
  },
  {
    id: 3,
    title: "Web Development with React",
    subject: "Computer Science",
    semester: "5th",
    course: "CS501",
    author: "Jane Smith",
    downloads: 1650,
    rating: 4.7,
    slides: 52,
    tags: ["react", "javascript", "frontend", "web"],
    uploadDate: "2024-01-15",
    preview: "Modern web development using React, hooks, and component-based architecture.",
    thumbnail: "/api/placeholder/400/300",
    duration: "3h 15m"
  }
];

export default function PPTs() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("downloads");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [savedPPTs, setSavedPPTs] = useState<number[]>([]);

  const toggleSavePPT = (pptId: number) => {
    setSavedPPTs(prev => 
      prev.includes(pptId) 
        ? prev.filter(id => id !== pptId)
        : [...prev, pptId]
    );
  };

  const filteredPPTs = mockPPTs.filter(ppt => {
    const matchesSearch = ppt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ppt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSemester = selectedSemester === "all" || ppt.semester === selectedSemester;
    const matchesSubject = selectedSubject === "all" || ppt.subject === selectedSubject;
    
    return matchesSearch && matchesSemester && matchesSubject;
  });

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Presentations
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Interactive presentations and slide decks for your studies
          </p>
          <SearchBar placeholder="Search presentations by title, subject, or tags..." />
        </motion.div>

        {/* Filters and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 mb-8 p-6 glass rounded-2xl border border-white/20"
        >
          <div className="flex-1 flex flex-col md:flex-row gap-4">
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Semesters</SelectItem>
                <SelectItem value="1st">1st Semester</SelectItem>
                <SelectItem value="2nd">2nd Semester</SelectItem>
                <SelectItem value="3rd">3rd Semester</SelectItem>
                <SelectItem value="4th">4th Semester</SelectItem>
                <SelectItem value="5th">5th Semester</SelectItem>
                <SelectItem value="6th">6th Semester</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Chemistry">Chemistry</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="downloads">Most Downloaded</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="slides">Slide Count</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
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
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-muted-foreground">
            Showing {filteredPPTs.length} of {mockPPTs.length} presentations
          </p>
        </motion.div>

        {/* PPTs Grid/List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={viewMode}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={
              viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {filteredPPTs.map((ppt, index) => (
              <motion.div
                key={ppt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className={`glass border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-medium overflow-hidden ${
                  viewMode === "list" ? "flex" : ""
                }`}>
                  {viewMode === "grid" ? (
                    <>
                      {/* Thumbnail with Play Button */}
                      <div className="relative group">
                        <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <Presentation className="w-16 h-16 text-primary opacity-50" />
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button variant="glass" size="icon" className="w-16 h-16">
                            <Play className="w-8 h-8" />
                          </Button>
                        </div>
                        <div className="absolute top-4 right-4">
                          <Button
                            variant="glass"
                            size="icon"
                            onClick={() => toggleSavePPT(ppt.id)}
                            className="w-8 h-8"
                          >
                            <Heart 
                              className={`w-4 h-4 ${
                                savedPPTs.includes(ppt.id) 
                                  ? "fill-red-500 text-red-500" 
                                  : "text-white"
                              }`} 
                            />
                          </Button>
                        </div>
                        <div className="absolute bottom-4 left-4">
                          <Badge variant="secondary" className="bg-black/50 text-white">
                            {ppt.slides} slides
                          </Badge>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg mb-2 line-clamp-2">
                              {ppt.title}
                            </h3>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary">{ppt.subject}</Badge>
                              <Badge variant="outline">{ppt.semester} Sem</Badge>
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {ppt.preview}
                        </p>

                        <div className="flex flex-wrap gap-1 mb-4">
                          {ppt.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                          <span className="flex items-center gap-1">
                            <Download className="w-4 h-4" />
                            {ppt.downloads}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            {ppt.rating}
                          </span>
                          <span>{ppt.duration}</span>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="w-4 h-4" />
                            Preview
                          </Button>
                          <Button variant="default" size="sm" className="flex-1">
                            <Download className="w-4 h-4" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex w-full">
                      <div className="w-48 shrink-0 relative group">
                        <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center rounded-l-2xl">
                          <Presentation className="w-12 h-12 text-primary opacity-50" />
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-l-2xl">
                          <Button variant="glass" size="icon">
                            <Play className="w-6 h-6" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex-1 p-6">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-lg">{ppt.title}</h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleSavePPT(ppt.id)}
                          >
                            <Heart 
                              className={`w-4 h-4 ${
                                savedPPTs.includes(ppt.id) 
                                  ? "fill-red-500 text-red-500" 
                                  : "text-muted-foreground"
                              }`} 
                            />
                          </Button>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{ppt.subject}</Badge>
                          <Badge variant="outline">{ppt.semester} Sem</Badge>
                          <span className="text-sm text-muted-foreground">by {ppt.author}</span>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">
                          {ppt.preview}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Download className="w-4 h-4" />
                              {ppt.downloads}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              {ppt.rating}
                            </span>
                            <span>{ppt.slides} slides</span>
                            <span>{ppt.duration}</span>
                          </div>

                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                              Preview
                            </Button>
                            <Button variant="default" size="sm">
                              <Download className="w-4 h-4" />
                              Download
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filteredPPTs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No presentations found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}