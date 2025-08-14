import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, FileText, Presentation, ScrollText, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Mock search results
const mockResults = [
  {
    id: 1,
    title: "Introduction to Data Structures",
    type: "notes",
    subject: "Computer Science",
    semester: "3rd",
    preview: "Comprehensive notes covering arrays, linked lists, stacks, and queues..."
  },
  {
    id: 2,
    title: "Operating Systems Presentation",
    type: "ppt",
    subject: "Computer Science",
    semester: "4th",
    preview: "Process management, memory allocation, and file systems..."
  },
  {
    id: 3,
    title: "Database Management Systems - 2023",
    type: "paper",
    subject: "Computer Science",
    semester: "5th",
    preview: "Mid-term examination paper with solutions..."
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case "notes": return FileText;
    case "ppt": return Presentation;
    case "paper": return ScrollText;
    default: return FileText;
  }
};

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  size?: "default" | "lg";
}

export const SearchBar = ({ 
  placeholder = "Search for notes, presentations, papers...", 
  className,
  size = "default" 
}: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState(mockResults);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      // Simulate search filtering
      const filtered = mockResults.filter(result =>
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.subject.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [query]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div ref={searchRef} className={cn("relative w-full max-w-2xl", className)}>
      <div className="relative">
        <Search className={cn(
          "absolute left-4 text-muted-foreground",
          size === "lg" ? "top-6 w-6 h-6" : "top-4 w-5 h-5"
        )} />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.length > 0 && setIsOpen(true)}
          className={cn(
            "pl-12 pr-4 glass border-white/20 text-foreground placeholder:text-muted-foreground bg-white/10 backdrop-blur-xl",
            size === "lg" 
              ? "h-16 text-lg rounded-3xl" 
              : "h-14 rounded-2xl"
          )}
        />
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 glass border border-white/20 rounded-2xl shadow-strong backdrop-blur-xl z-50 max-h-96 overflow-y-auto"
          >
            <div className="p-2">
              {results.map((result, index) => {
                const Icon = getIcon(result.type);
                return (
                  <motion.div
                    key={result.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group"
                  >
                    <Button
                      variant="ghost"
                      className="w-full p-4 h-auto justify-start text-left hover:bg-white/10 rounded-xl"
                      onClick={() => {
                        setIsOpen(false);
                        setQuery("");
                      }}
                    >
                      <div className="flex items-start space-x-3 w-full">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-foreground truncate">
                              {result.title}
                            </h3>
                            <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {result.subject} • {result.semester} Semester
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {result.preview}
                          </p>
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                );
              })}
            </div>
            {results.length === 0 && query.length > 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No results found for "{query}"</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};