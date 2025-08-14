import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { 
  Upload as UploadIcon, 
  FileText, 
  Presentation, 
  ScrollText,
  X,
  Check,
  AlertCircle,
  Tag,
  User,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: "uploading" | "completed" | "error";
}

const fileTypeIcons = {
  "application/pdf": FileText,
  "application/vnd.ms-powerpoint": Presentation,
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": Presentation,
  "application/msword": ScrollText,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ScrollText,
};

const suggestedTags = [
  "algorithms", "data-structures", "programming", "java", "python", "cpp",
  "oop", "database", "sql", "machine-learning", "ai", "web-development",
  "mathematics", "calculus", "linear-algebra", "physics", "chemistry",
  "engineering", "computer-networks", "operating-systems", "software-engineering"
];

export default function Upload() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [semester, setSemester] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFiles = (fileList: File[]) => {
    const newFiles: UploadedFile[] = fileList.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      progress: 0,
      status: "uploading"
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach((file) => {
      simulateUpload(file.id);
    });

    // Auto-suggest title from first file
    if (!title && fileList[0]) {
      const fileName = fileList[0].name.replace(/\.[^/.]+$/, "");
      setTitle(fileName.replace(/[-_]/g, " "));
    }
  };

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setFiles(prev => prev.map(file => {
        if (file.id === fileId) {
          const newProgress = Math.min(file.progress + Math.random() * 15, 100);
          const newStatus = newProgress === 100 ? "completed" : "uploading";
          
          if (newProgress === 100) {
            clearInterval(interval);
          }
          
          return { ...file, progress: newProgress, status: newStatus };
        }
        return file;
      }));
    }, 200);
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      setTags(prev => [...prev, tag]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({
      title,
      description,
      subject,
      semester,
      courseCode,
      tags,
      files
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Upload Resources
          </h1>
          <p className="text-xl text-muted-foreground">
            Share your study materials with the community
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* File Upload Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass border-white/20">
              <div
                className={`p-8 border-2 border-dashed rounded-2xl transition-all duration-300 ${
                  dragActive 
                    ? "border-primary bg-primary/5" 
                    : "border-muted-foreground/30 hover:border-primary/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="text-center">
                  <UploadIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">
                    Drop your files here
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    or click to browse your computer
                  </p>
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => document.getElementById('file-input')?.click()}
                  >
                    Choose Files
                  </Button>
                  <input
                    id="file-input"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => e.target.files && handleFiles(Array.from(e.target.files))}
                    accept=".pdf,.ppt,.pptx,.doc,.docx"
                  />
                  <p className="text-xs text-muted-foreground mt-4">
                    Supports: PDF, PPT, PPTX, DOC, DOCX (Max 50MB each)
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Uploaded Files */}
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="glass border-white/20 p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Uploaded Files ({files.length})
                </h3>
                <div className="space-y-3">
                  {files.map((file) => {
                    const IconComponent = fileTypeIcons[file.type as keyof typeof fileTypeIcons] || FileText;
                    
                    return (
                      <div key={file.id} className="flex items-center gap-3 p-3 bg-muted/20 rounded-xl">
                        <IconComponent className="w-8 h-8 text-primary shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium truncate">{file.name}</p>
                            <div className="flex items-center gap-2">
                              {file.status === "completed" && (
                                <Check className="w-4 h-4 text-green-500" />
                              )}
                              {file.status === "error" && (
                                <AlertCircle className="w-4 h-4 text-red-500" />
                              )}
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="w-6 h-6"
                                onClick={() => removeFile(file.id)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={file.progress} className="flex-1 h-2" />
                            <span className="text-xs text-muted-foreground">
                              {formatFileSize(file.size)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          )}

          {/* Resource Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass border-white/20 p-6">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Resource Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter a descriptive title"
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Select value={subject} onValueChange={setSubject} required>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Economics">Economics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="semester">Semester *</Label>
                  <Select value={semester} onValueChange={setSemester} required>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1st">1st Semester</SelectItem>
                      <SelectItem value="2nd">2nd Semester</SelectItem>
                      <SelectItem value="3rd">3rd Semester</SelectItem>
                      <SelectItem value="4th">4th Semester</SelectItem>
                      <SelectItem value="5th">5th Semester</SelectItem>
                      <SelectItem value="6th">6th Semester</SelectItem>
                      <SelectItem value="7th">7th Semester</SelectItem>
                      <SelectItem value="8th">8th Semester</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="course-code">Course Code</Label>
                  <Input
                    id="course-code"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    placeholder="e.g., CS301, MATH201"
                    className="mt-2"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a detailed description of your resource"
                    className="mt-2 min-h-32"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="mt-2 space-y-3">
                    <div className="flex gap-2">
                      <Input
                        id="tags"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add tags (e.g., algorithms, java, programming)"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addTag(newTag);
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => addTag(newTag)}
                      >
                        <Tag className="w-4 h-4" />
                        Add
                      </Button>
                    </div>

                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                            {tag}
                            <X
                              className="w-3 h-3 cursor-pointer hover:text-destructive"
                              onClick={() => removeTag(tag)}
                            />
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Suggested tags:</p>
                      <div className="flex flex-wrap gap-2">
                        {suggestedTags.slice(0, 10).map(tag => (
                          <Button
                            key={tag}
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => addTag(tag)}
                            disabled={tags.includes(tag)}
                          >
                            #{tag}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex gap-4"
          >
            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="flex-1 md:flex-none"
              disabled={files.length === 0 || !title || !subject || !semester}
            >
              <UploadIcon className="w-5 h-5" />
              Publish Resource
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => {
                setTitle("");
                setDescription("");
                setSubject("");
                setSemester("");
                setCourseCode("");
                setTags([]);
                setFiles([]);
              }}
            >
              Clear All
            </Button>
          </motion.div>
        </form>
      </div>
    </div>
  );
}