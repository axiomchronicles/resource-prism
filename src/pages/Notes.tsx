import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Filter, 
  Download, 
  Eye, 
  Star, 
  Heart,
  Search,
  Grid3X3,
  List,
  ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useToast } from "@/hooks/use-toast";
import { QuickPreviewDrawer } from "@/components/QuickPreviewDrawer";
import { useAppStore } from "@/stores/appStore";

const mockNotes = [
  {
    id: 1,
    title: "Data Structures and Algorithms Complete Guide",
    subject: "Computer Science",
    semester: "3rd",
    course: "CS301",
    author: "John Doe",
    downloads: 1240,
    rating: 4.9,
    pages: 45,
    tags: ["algorithms", "data-structures", "programming"],
    uploadDate: "2024-01-15",
    preview: "Comprehensive guide covering arrays, linked lists, trees, graphs, and advanced algorithms with examples.",
    thumbnail: "/api/placeholder/300/200"
  },
  {
    id: 2,
    title: "Object-Oriented Programming Concepts",
    subject: "Computer Science",
    semester: "2nd",
    course: "CS201",
    author: "Jane Smith",
    downloads: 890,
    rating: 4.7,
    pages: 32,
    tags: ["oop", "java", "concepts"],
    uploadDate: "2024-01-10",
    preview: "Essential OOP concepts including inheritance, polymorphism, encapsulation, and abstraction.",
    thumbnail: "/api/placeholder/300/200"
  },
  {
    id: 3,
    title: "Database Management Systems",
    subject: "Computer Science",
    semester: "4th",
    course: "CS401",
    author: "Mike Johnson",
    downloads: 650,
    rating: 4.8,
    pages: 38,
    tags: ["database", "sql", "normalization"],
    uploadDate: "2024-01-08",
    preview: "Complete notes on RDBMS concepts, SQL queries, normalization, and database design principles.",
    thumbnail: "/api/placeholder/300/200"
  },
  {
    id: 4,
    title: "Machine Learning Fundamentals",
    subject: "Computer Science",
    semester: "6th",
    course: "CS601",
    author: "Sarah Wilson",
    downloads: 1100,
    rating: 4.9,
    pages: 52,
    tags: ["ml", "python", "algorithms"],
    uploadDate: "2024-01-05",
    preview: "Introduction to machine learning algorithms, supervised and unsupervised learning techniques.",
    thumbnail: "/api/placeholder/300/200"
  }
];

export default function Notes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("downloads");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [savedNotes, setSavedNotes] = useState<number[]>([]);
  const { setPreviewResource, previewResource } = useAppStore();

  const toggleSaveNote = (noteId: number) => {
    setSavedNotes(prev => 
      prev.includes(noteId) 
        ? prev.filter(id => id !== noteId)
        : [...prev, noteId]
    );
  };

  const filteredNotes = mockNotes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesSemester = selectedSemester === "all" || note.semester === selectedSemester;
    const matchesSubject = selectedSubject === "all" || note.subject === selectedSubject;
    
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
            Study Notes
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Discover comprehensive study materials shared by students
          </p>
          <SearchBar placeholder="Search notes by title, subject, or tags..." />
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
                <SelectItem value="pages">Page Count</SelectItem>
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
            Showing {filteredNotes.length} of {mockNotes.length} notes
          </p>
        </motion.div>

        {/* Notes Grid/List */}
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
            {filteredNotes.map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className={`glass border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-medium overflow-hidden ${
                  viewMode === "list" ? "flex" : ""
                }`}>
                  {viewMode === "grid" ? (
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-2 line-clamp-2">
                            {note.title}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">{note.subject}</Badge>
                            <Badge variant="outline">{note.semester} Sem</Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleSaveNote(note.id)}
                          className="shrink-0"
                        >
                          <Heart 
                            className={`w-4 h-4 ${
                              savedNotes.includes(note.id) 
                                ? "fill-red-500 text-red-500" 
                                : "text-muted-foreground"
                            }`} 
                          />
                        </Button>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {note.preview}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {note.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          {note.downloads}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          {note.rating}
                        </span>
                        <span>{note.pages} pages</span>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => setPreviewResource({
                            id: note.id.toString(),
                            title: note.title,
                            type: 'pdf',
                            subject: note.subject,
                            semester: note.semester,
                            author: note.author,
                            authorId: 'author1',
                            uploadDate: note.uploadDate,
                            downloadUrl: '/sample.pdf',
                            fileSize: '2.5 MB',
                            downloads: note.downloads,
                            rating: note.rating,
                            tags: note.tags,
                            description: note.preview,
                            pages: note.pages,
                            difficulty: 'Medium'
                          })}
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </Button>
                        <Button variant="default" size="sm" className="flex-1">
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex w-full p-6">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-lg">{note.title}</h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleSaveNote(note.id)}
                          >
                            <Heart 
                              className={`w-4 h-4 ${
                                savedNotes.includes(note.id) 
                                  ? "fill-red-500 text-red-500" 
                                  : "text-muted-foreground"
                              }`} 
                            />
                          </Button>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{note.subject}</Badge>
                          <Badge variant="outline">{note.semester} Sem</Badge>
                          <span className="text-sm text-muted-foreground">by {note.author}</span>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">
                          {note.preview}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Download className="w-4 h-4" />
                              {note.downloads}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              {note.rating}
                            </span>
                            <span>{note.pages} pages</span>
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

        {filteredNotes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No notes found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters
            </p>
          </motion.div>
        )}

      <QuickPreviewDrawer
        resource={previewResource}
        isOpen={!!previewResource}
        onClose={() => setPreviewResource(null)}
      />
      </div>
    </div>
  );
}