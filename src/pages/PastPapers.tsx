import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ScrollText, 
  Download, 
  Eye, 
  Star, 
  Heart,
  Clock,
  Calendar,
  Grid3X3,
  List,
  Search,
  Filter,
  ChevronDown
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const mockPapers = [
  {
    id: 1,
    title: "Data Structures Mid-Term Examination",
    subject: "Computer Science",
    semester: "3rd",
    course: "CS301",
    year: "2023",
    exam_type: "mid-term",
    university: "MIT",
    duration: "3 hours",
    marks: 100,
    downloads: 1540,
    rating: 4.9,
    pages: 8,
    tags: ["algorithms", "data-structures", "mid-term"],
    upload_date: "2024-01-20",
    has_solutions: true,
    difficulty: "medium",
    author: "Prof. John Smith"
  },
  {
    id: 2,
    title: "Machine Learning Final Exam",
    subject: "Computer Science",
    semester: "6th",
    course: "CS601",
    year: "2023",
    exam_type: "final",
    university: "Stanford",
    duration: "4 hours",
    marks: 150,
    downloads: 2890,
    rating: 4.8,
    pages: 12,
    tags: ["ml", "python", "final", "ai"],
    upload_date: "2024-01-18",
    has_solutions: true,
    difficulty: "hard",
    author: "Dr. Sarah Wilson"
  },
  {
    id: 3,
    title: "Database Systems Quiz Papers",
    subject: "Computer Science",
    semester: "4th",
    course: "CS401",
    year: "2023",
    exam_type: "quiz",
    university: "Berkeley",
    duration: "1 hour",
    marks: 50,
    downloads: 950,
    rating: 4.6,
    pages: 4,
    tags: ["database", "sql", "quiz"],
    upload_date: "2024-01-15",
    has_solutions: false,
    difficulty: "easy",
    author: "Prof. Mike Johnson"
  }
];

const examTypes = [
  { value: "all", label: "All Exams" },
  { value: "mid-term", label: "Mid-Term" },
  { value: "final", label: "Final Exam" },
  { value: "quiz", label: "Quiz" },
  { value: "assignment", label: "Assignment" }
];

const years = ["2024", "2023", "2022", "2021", "2020"];

export default function PastPapers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("year");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedExamType, setSelectedExamType] = useState("all");
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [savedPapers, setSavedPapers] = useState<number[]>([]);

  const toggleSavePaper = (paperId: number) => {
    setSavedPapers(prev => 
      prev.includes(paperId) 
        ? prev.filter(id => id !== paperId)
        : [...prev, paperId]
    );
  };

  const filteredPapers = mockPapers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         paper.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesYear = selectedYear === "all" || paper.year === selectedYear;
    const matchesExamType = selectedExamType === "all" || paper.exam_type === selectedExamType;
    const matchesSemester = selectedSemester === "all" || paper.semester === selectedSemester;
    const matchesSubject = selectedSubject === "all" || paper.subject === selectedSubject;
    
    return matchesSearch && matchesYear && matchesExamType && matchesSemester && matchesSubject;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
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
            Past Papers
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Previous year question papers and exam materials
          </p>
          <SearchBar placeholder="Search past papers by title, subject, or year..." />
        </motion.div>

        {/* Exam Type Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Tabs value={selectedExamType} onValueChange={setSelectedExamType}>
            <TabsList className="grid w-full grid-cols-5 glass border border-white/20">
              {examTypes.map(type => (
                <TabsTrigger key={type.value} value={type.value}>
                  {type.label}
                </TabsTrigger>
              ))}
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
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
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
                <SelectItem value="year">Latest Year</SelectItem>
                <SelectItem value="downloads">Most Downloaded</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="difficulty">Difficulty</SelectItem>
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
            Showing {filteredPapers.length} of {mockPapers.length} past papers
          </p>
        </motion.div>

        {/* Papers Grid/List */}
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
            {filteredPapers.map((paper, index) => (
              <motion.div
                key={paper.id}
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
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">{paper.exam_type}</Badge>
                            <Badge variant="outline">{paper.year}</Badge>
                            <Badge className={getDifficultyColor(paper.difficulty)}>
                              {paper.difficulty}
                            </Badge>
                          </div>
                          <h3 className="font-bold text-lg mb-2 line-clamp-2">
                            {paper.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {paper.subject} • {paper.semester} Semester • {paper.course}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {paper.university} • {paper.author}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleSavePaper(paper.id)}
                          className="shrink-0"
                        >
                          <Heart 
                            className={`w-4 h-4 ${
                              savedPapers.includes(paper.id) 
                                ? "fill-red-500 text-red-500" 
                                : "text-muted-foreground"
                            }`} 
                          />
                        </Button>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {paper.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <ScrollText className="w-4 h-4" />
                          {paper.pages} pages
                        </span>
                        <span>{paper.marks} marks</span>
                      </div>

                      {paper.has_solutions && (
                        <div className="mb-4">
                          <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                            Solutions Available
                          </Badge>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1 mb-4">
                        {paper.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          {paper.downloads}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          {paper.rating}
                        </span>
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
                  ) : (
                    <div className="flex w-full p-6">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary">{paper.exam_type}</Badge>
                              <Badge variant="outline">{paper.year}</Badge>
                              <Badge className={getDifficultyColor(paper.difficulty)}>
                                {paper.difficulty}
                              </Badge>
                              {paper.has_solutions && (
                                <Badge variant="default" className="bg-green-500">
                                  Solutions
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-bold text-lg mb-1">{paper.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {paper.subject} • {paper.semester} Semester • {paper.course} • {paper.university}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleSavePaper(paper.id)}
                          >
                            <Heart 
                              className={`w-4 h-4 ${
                                savedPapers.includes(paper.id) 
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
                              {paper.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <Download className="w-4 h-4" />
                              {paper.downloads}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              {paper.rating}
                            </span>
                            <span>{paper.marks} marks</span>
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

        {filteredPapers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No past papers found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}