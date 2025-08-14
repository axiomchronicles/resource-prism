import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PlayCircle, 
  Download, 
  Eye, 
  Star, 
  Heart,
  Clock,
  Users,
  Grid3X3,
  List,
  Search,
  Filter,
  ExternalLink,
  Youtube,
  FileText,
  Link as LinkIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchBar } from "@/components/SearchBar";

const mockTutorials = [
  {
    id: 1,
    title: "Complete React.js Course for Beginners",
    description: "Learn React from scratch with hands-on projects and real-world examples",
    type: "video",
    format: "youtube",
    subject: "Computer Science",
    semester: "5th",
    course: "CS501",
    instructor: "John Doe",
    duration: "4h 30m",
    difficulty: "beginner",
    views: 125000,
    rating: 4.9,
    url: "https://youtube.com/watch?v=example",
    thumbnail: "/api/placeholder/400/300",
    tags: ["react", "javascript", "frontend", "web-development"],
    upload_date: "2024-01-20",
    chapters: 15,
    language: "English"
  },
  {
    id: 2,
    title: "Python Machine Learning Tutorial Series",
    description: "Master machine learning concepts with Python and scikit-learn",
    type: "video",
    format: "playlist",
    subject: "Computer Science",
    semester: "6th",
    course: "CS601",
    instructor: "Dr. Sarah Wilson",
    duration: "8h 15m",
    difficulty: "intermediate",
    views: 89000,
    rating: 4.8,
    url: "https://youtube.com/playlist?list=example",
    thumbnail: "/api/placeholder/400/300",
    tags: ["python", "machine-learning", "ai", "data-science"],
    upload_date: "2024-01-18",
    chapters: 25,
    language: "English"
  },
  {
    id: 3,
    title: "Database Design Best Practices",
    description: "Comprehensive guide to designing efficient and scalable databases",
    type: "pdf",
    format: "document",
    subject: "Computer Science",
    semester: "4th",
    course: "CS401",
    instructor: "Prof. Mike Johnson",
    duration: "2h read",
    difficulty: "intermediate",
    views: 34000,
    rating: 4.7,
    url: "/documents/database-design-guide.pdf",
    thumbnail: "/api/placeholder/400/300",
    tags: ["database", "sql", "design", "normalization"],
    upload_date: "2024-01-15",
    chapters: 8,
    language: "English"
  },
  {
    id: 4,
    title: "Interactive Web Development Workshop",
    description: "Build dynamic web applications with HTML, CSS, and JavaScript",
    type: "interactive",
    format: "external",
    subject: "Computer Science",
    semester: "3rd",
    course: "CS301",
    instructor: "Jane Smith",
    duration: "6h workshop",
    difficulty: "beginner",
    views: 67000,
    rating: 4.6,
    url: "https://workshop.example.com",
    thumbnail: "/api/placeholder/400/300",
    tags: ["html", "css", "javascript", "workshop"],
    upload_date: "2024-01-12",
    chapters: 12,
    language: "English"
  }
];

const tutorialTypes = [
  { value: "all", label: "All Types", icon: PlayCircle },
  { value: "video", label: "Videos", icon: Youtube },
  { value: "pdf", label: "Documents", icon: FileText },
  { value: "interactive", label: "Interactive", icon: ExternalLink }
];

const difficulties = [
  { value: "all", label: "All Levels" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" }
];

export default function Tutorials() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("views");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [savedTutorials, setSavedTutorials] = useState<number[]>([]);

  const toggleSaveTutorial = (tutorialId: number) => {
    setSavedTutorials(prev => 
      prev.includes(tutorialId) 
        ? prev.filter(id => id !== tutorialId)
        : [...prev, tutorialId]
    );
  };

  const filteredTutorials = mockTutorials.filter(tutorial => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tutorial.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === "all" || tutorial.type === selectedType;
    const matchesDifficulty = selectedDifficulty === "all" || tutorial.difficulty === selectedDifficulty;
    const matchesSemester = selectedSemester === "all" || tutorial.semester === selectedSemester;
    const matchesSubject = selectedSubject === "all" || tutorial.subject === selectedSubject;
    
    return matchesSearch && matchesType && matchesDifficulty && matchesSemester && matchesSubject;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return Youtube;
      case "pdf": return FileText;
      case "interactive": return ExternalLink;
      default: return PlayCircle;
    }
  };

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
            Tutorials & Guides
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Interactive learning materials and step-by-step guides
          </p>
          <SearchBar placeholder="Search tutorials by title, topic, or instructor..." />
        </motion.div>

        {/* Type Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Tabs value={selectedType} onValueChange={setSelectedType}>
            <TabsList className="grid w-full grid-cols-4 glass border border-white/20">
              {tutorialTypes.map(type => {
                const Icon = type.icon;
                return (
                  <TabsTrigger key={type.value} value={type.value} className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {type.label}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Filters and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col md:flex-row gap-4 mb-8 p-6 glass rounded-2xl border border-white/20"
        >
          <div className="flex-1 flex flex-col md:flex-row gap-4">
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map(difficulty => (
                  <SelectItem key={difficulty.value} value={difficulty.value}>
                    {difficulty.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

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
                <SelectItem value="views">Most Viewed</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
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
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <p className="text-muted-foreground">
            Showing {filteredTutorials.length} of {mockTutorials.length} tutorials
          </p>
        </motion.div>

        {/* Tutorials Grid/List */}
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
            {filteredTutorials.map((tutorial, index) => {
              const TypeIcon = getTypeIcon(tutorial.type);
              
              return (
                <motion.div
                  key={tutorial.id}
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
                            <TypeIcon className="w-16 h-16 text-primary opacity-50" />
                          </div>
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button variant="glass" size="icon" className="w-16 h-16">
                              <PlayCircle className="w-8 h-8" />
                            </Button>
                          </div>
                          <div className="absolute top-4 right-4">
                            <Button
                              variant="glass"
                              size="icon"
                              onClick={() => toggleSaveTutorial(tutorial.id)}
                              className="w-8 h-8"
                            >
                              <Heart 
                                className={`w-4 h-4 ${
                                  savedTutorials.includes(tutorial.id) 
                                    ? "fill-red-500 text-red-500" 
                                    : "text-white"
                                }`} 
                              />
                            </Button>
                          </div>
                          <div className="absolute bottom-4 left-4 flex gap-2">
                            <Badge variant="secondary" className="bg-black/50 text-white">
                              {tutorial.duration}
                            </Badge>
                            <Badge className={getDifficultyColor(tutorial.difficulty)}>
                              {tutorial.difficulty}
                            </Badge>
                          </div>
                        </div>

                        <div className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="font-bold text-lg mb-2 line-clamp-2">
                                {tutorial.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {tutorial.description}
                              </p>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="secondary">{tutorial.subject}</Badge>
                                <Badge variant="outline">{tutorial.semester} Sem</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                by {tutorial.instructor}
                              </p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-4">
                            {tutorial.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
                                #{tag}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {tutorial.views.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              {tutorial.rating}
                            </span>
                            <span>{tutorial.chapters} chapters</span>
                          </div>

                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Eye className="w-4 h-4" />
                              Preview
                            </Button>
                            <Button variant="default" size="sm" className="flex-1">
                              <ExternalLink className="w-4 h-4" />
                              Start Learning
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="flex w-full">
                        <div className="w-48 shrink-0 relative group">
                          <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center rounded-l-2xl">
                            <TypeIcon className="w-12 h-12 text-primary opacity-50" />
                          </div>
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-l-2xl">
                            <Button variant="glass" size="icon">
                              <PlayCircle className="w-6 h-6" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="secondary">{tutorial.type}</Badge>
                                <Badge className={getDifficultyColor(tutorial.difficulty)}>
                                  {tutorial.difficulty}
                                </Badge>
                              </div>
                              <h3 className="font-bold text-lg mb-1">{tutorial.title}</h3>
                              <p className="text-sm text-muted-foreground mb-2">
                                {tutorial.description}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {tutorial.subject} • {tutorial.semester} Semester • by {tutorial.instructor}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleSaveTutorial(tutorial.id)}
                            >
                              <Heart 
                                className={`w-4 h-4 ${
                                  savedTutorials.includes(tutorial.id) 
                                    ? "fill-red-500 text-red-500" 
                                    : "text-muted-foreground"
                                }`} 
                              />
                            </Button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {tutorial.duration}
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {tutorial.views.toLocaleString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                {tutorial.rating}
                              </span>
                            </div>

                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                                Preview
                              </Button>
                              <Button variant="default" size="sm">
                                <ExternalLink className="w-4 h-4" />
                                Start
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {filteredTutorials.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No tutorials found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}