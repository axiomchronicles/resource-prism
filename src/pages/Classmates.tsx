import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Search, 
  Filter, 
  MessageCircle, 
  UserPlus, 
  MapPin, 
  GraduationCap,
  Mail,
  Star,
  Clock,
  Building
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchBar } from "@/components/SearchBar";

interface Student {
  id: string;
  name: string;
  avatar: string;
  university: string;
  course: string;
  semester: string;
  year: string;
  location: string;
  bio: string;
  subjects: string[];
  rating: number;
  resourcesShared: number;
  joinDate: string;
  isOnline: boolean;
  lastSeen: string;
  skills: string[];
  studyGroups: string[];
}

const mockStudents: Student[] = [
  {
    id: "1",
    name: "Alex Johnson",
    avatar: "/api/placeholder/100/100",
    university: "MIT",
    course: "Computer Science",
    semester: "6th",
    year: "2024",
    location: "Boston, MA",
    bio: "Passionate about machine learning and data science. Love sharing knowledge and helping fellow students succeed.",
    subjects: ["Machine Learning", "Data Structures", "Algorithms"],
    rating: 4.8,
    resourcesShared: 45,
    joinDate: "2023-09-15",
    isOnline: true,
    lastSeen: "Just now",
    skills: ["Python", "JavaScript", "Machine Learning", "React"],
    studyGroups: ["AI Research Group", "Coding Club"]
  },
  {
    id: "2",
    name: "Sarah Chen",
    avatar: "/api/placeholder/100/100",
    university: "Stanford University",
    course: "Electrical Engineering",
    semester: "4th",
    year: "2025",
    location: "Palo Alto, CA",
    bio: "Electronics enthusiast with a focus on embedded systems and IoT. Active in robotics competitions.",
    subjects: ["Circuit Design", "Embedded Systems", "Signal Processing"],
    rating: 4.9,
    resourcesShared: 32,
    joinDate: "2023-08-20",
    isOnline: false,
    lastSeen: "2 hours ago",
    skills: ["C++", "Arduino", "MATLAB", "PCB Design"],
    studyGroups: ["Robotics Club", "IEEE Student Chapter"]
  },
  {
    id: "3",
    name: "Marcus Rodriguez",
    avatar: "/api/placeholder/100/100",
    university: "UC Berkeley",
    course: "Mathematics",
    semester: "8th",
    year: "2024",
    location: "Berkeley, CA",
    bio: "Pure mathematics student specializing in abstract algebra and topology. Tutor for undergrad math courses.",
    subjects: ["Abstract Algebra", "Real Analysis", "Topology"],
    rating: 4.7,
    resourcesShared: 67,
    joinDate: "2022-01-10",
    isOnline: true,
    lastSeen: "5 minutes ago",
    skills: ["Mathematical Proofs", "LaTeX", "Mathematica", "Teaching"],
    studyGroups: ["Math Study Circle", "Graduate Seminar"]
  },
  {
    id: "4",
    name: "Emma Thompson",
    avatar: "/api/placeholder/100/100",
    university: "Harvard University",
    course: "Biology",
    semester: "5th",
    year: "2025",
    location: "Cambridge, MA",
    bio: "Pre-med student with research focus on molecular biology and genetics. Lab assistant at Harvard Medical.",
    subjects: ["Molecular Biology", "Genetics", "Biochemistry"],
    rating: 4.9,
    resourcesShared: 28,
    joinDate: "2023-10-05",
    isOnline: false,
    lastSeen: "1 day ago",
    skills: ["Lab Techniques", "Research", "Data Analysis", "Academic Writing"],
    studyGroups: ["Pre-Med Society", "Biology Research Group"]
  },
  {
    id: "5",
    name: "David Kim",
    avatar: "/api/placeholder/100/100",
    university: "Caltech",
    course: "Physics",
    semester: "7th",
    year: "2024",
    location: "Pasadena, CA",
    bio: "Theoretical physics PhD candidate working on quantum mechanics and particle physics. Teaching assistant.",
    subjects: ["Quantum Mechanics", "Particle Physics", "Statistical Mechanics"],
    rating: 4.8,
    resourcesShared: 89,
    joinDate: "2021-09-01",
    isOnline: true,
    lastSeen: "Just now",
    skills: ["Mathematical Physics", "Programming", "Research", "Teaching"],
    studyGroups: ["Physics Graduate Society", "Quantum Computing Club"]
  }
];

export default function Classmates() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.subjects.some(subject => subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
                         student.bio.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesUniversity = selectedUniversity === "all" || student.university === selectedUniversity;
    const matchesCourse = selectedCourse === "all" || student.course === selectedCourse;
    const matchesYear = selectedYear === "all" || student.year === selectedYear;
    
    return matchesSearch && matchesUniversity && matchesCourse && matchesYear;
  });

  const handleConnect = (studentId: string) => {
    console.log("Connecting to student:", studentId);
  };

  const handleMessage = (studentId: string) => {
    console.log("Messaging student:", studentId);
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4 flex items-center gap-3">
            <Users className="w-10 h-10 text-primary" />
            Find Classmates
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            Connect with fellow students from your university and beyond
          </p>
          <SearchBar placeholder="Search by name, subject, or skills..." />
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 mb-8 p-6 glass rounded-2xl border border-white/20"
        >
          <div className="flex-1 flex flex-col md:flex-row gap-4">
            <Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="University" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Universities</SelectItem>
                <SelectItem value="MIT">MIT</SelectItem>
                <SelectItem value="Stanford University">Stanford University</SelectItem>
                <SelectItem value="Harvard University">Harvard University</SelectItem>
                <SelectItem value="UC Berkeley">UC Berkeley</SelectItem>
                <SelectItem value="Caltech">Caltech</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                <SelectItem value="Mathematics">Mathematics</SelectItem>
                <SelectItem value="Physics">Physics</SelectItem>
                <SelectItem value="Biology">Biology</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="resources">Most Resources</SelectItem>
                <SelectItem value="recent">Recently Joined</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
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
            Found {filteredStudents.length} students
          </p>
        </motion.div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student, index) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="glass border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-medium overflow-hidden">
                <div className="p-6">
                  {/* Profile Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={student.avatar} alt={student.name} />
                        <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      {student.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-background rounded-full" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg truncate">{student.name}</h3>
                      <div className="flex items-center gap-2 mb-1">
                        <Building className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground truncate">{student.university}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-3 h-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{student.course}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status and Location */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${student.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                      <span className="text-sm text-muted-foreground">
                        {student.isOnline ? 'Online' : student.lastSeen}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span>{student.location}</span>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {student.bio}
                  </p>

                  {/* Subjects */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Subjects</h4>
                    <div className="flex flex-wrap gap-1">
                      {student.subjects.slice(0, 3).map(subject => (
                        <Badge key={subject} variant="secondary" className="text-xs">
                          {subject}
                        </Badge>
                      ))}
                      {student.subjects.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{student.subjects.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {student.skills.slice(0, 4).map(skill => (
                        <span key={skill} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-md">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{student.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{student.resourcesShared} resources</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Joined {new Date(student.joinDate).getFullYear()}</span>
                    </div>
                  </div>

                  {/* Study Groups */}
                  {student.studyGroups.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium mb-2">Study Groups</h4>
                      <div className="space-y-1">
                        {student.studyGroups.slice(0, 2).map(group => (
                          <div key={group} className="text-xs text-muted-foreground flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            <span>{group}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleConnect(student.id)}
                    >
                      <UserPlus className="w-4 h-4 mr-1" />
                      Connect
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleMessage(student.id)}
                    >
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Message
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No students found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}