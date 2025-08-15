import { motion } from "framer-motion";
import { 
  FileText, 
  Presentation, 
  ScrollText, 
  PlayCircle, 
  TrendingUp,
  Users,
  Download,
  Star,
  ArrowRight,
  Search
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/SearchBar";
import { Card } from "@/components/ui/card";
import { QuickPreviewDrawer } from "@/components/QuickPreviewDrawer";
import { useAppStore } from "@/stores/appStore";
import heroImage from "@/assets/hero-bg.jpg";

const categories = [
  {
    title: "Notes",
    description: "Study materials and lecture notes",
    icon: FileText,
    href: "/notes",
    count: "2,450+",
    color: "from-blue-500 to-blue-600"
  },
  {
    title: "PPTs",
    description: "Presentations and slide decks",
    icon: Presentation,
    href: "/ppts",
    count: "1,280+",
    color: "from-purple-500 to-purple-600"
  },
  {
    title: "Past Papers",
    description: "Previous year question papers",
    icon: ScrollText,
    href: "/past-papers",
    count: "890+",
    color: "from-green-500 to-green-600"
  },
  {
    title: "Tutorials",
    description: "Video guides and how-tos",
    icon: PlayCircle,
    href: "/tutorials",
    count: "560+",
    color: "from-orange-500 to-orange-600"
  }
];

const trendingResources = [
  {
    title: "Data Structures & Algorithms",
    type: "Notes",
    downloads: 1240,
    rating: 4.9,
    subject: "Computer Science"
  },
  {
    title: "Machine Learning Basics",
    type: "PPT",
    downloads: 980,
    rating: 4.8,
    subject: "Computer Science"
  },
  {
    title: "Database Systems 2023",
    type: "Paper",
    downloads: 760,
    rating: 4.7,
    subject: "Computer Science"
  }
];

const stats = [
  { label: "Resources", value: "5,180+" },
  { label: "Students", value: "12,000+" },
  { label: "Downloads", value: "45,000+" },
  { label: "Universities", value: "50+" }
];

export default function Home() {
  const { setPreviewResource, previewResource } = useAppStore();
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        
        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Find
              </span>{" "}
              <span className="text-foreground">
                Every Resource
              </span>{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                You Need
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Access thousands of study materials, presentations, and past papers
              <br />
              shared by students from top universities
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mb-12"
          >
            <SearchBar size="lg" className="mx-auto" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button variant="hero" size="lg" asChild>
              <Link to="/notes">
                Browse Resources
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="glass" size="lg" asChild>
              <Link to="/upload">
                Upload Material
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Floating elements */}
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-20 h-20 bg-gradient-primary rounded-2xl glass opacity-20"
        />
        <motion.div
          animate={{ y: [10, -10, 10] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-10 w-16 h-16 bg-gradient-secondary rounded-2xl glass opacity-20"
        />
      </section>

      {/* Stats Section */}
      <section className="py-16 glass border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-sm md:text-base">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Explore by Category
            </h2>
            <p className="text-xl text-muted-foreground">
              Find exactly what you're looking for
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group"
                >
                  <Link to={category.href}>
                    <Card className="p-8 h-full glass border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-strong">
                      <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-3">{category.title}</h3>
                      <p className="text-muted-foreground mb-4">{category.description}</p>
                      <div className="text-lg font-semibold text-primary">
                        {category.count} resources
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-20 glass border-y">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-12"
          >
            <div>
              <h2 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-primary" />
                Trending This Week
              </h2>
              <p className="text-xl text-muted-foreground">
                Most popular resources among students
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/trending">
                View All
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingResources.map((resource, index) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="p-6 glass border-white/20 hover:border-white/40 transition-all duration-300 hover:shadow-medium">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-2">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{resource.subject}</p>
                      <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                        {resource.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Download className="w-4 h-4" />
                        {resource.downloads}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        {resource.rating}
                      </span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setPreviewResource({
                        id: resource.title,
                        title: resource.title,
                        type: 'pdf',
                        subject: resource.subject,
                        semester: '3rd',
                        author: 'Student',
                        authorId: 'student1',
                        uploadDate: '2024-01-15',
                        downloadUrl: '/sample.pdf',
                        fileSize: '2.5 MB',
                        downloads: resource.downloads,
                        rating: resource.rating,
                        tags: [resource.type],
                        description: `Preview of ${resource.title}`,
                        difficulty: 'Medium'
                      })}
                    >
                      <Search className="w-4 h-4 mr-2" />
                      Quick Preview
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Share Your Knowledge?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of students contributing to our growing library of academic resources
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" asChild>
                <Link to="/upload">
                  <Users className="w-5 h-5" />
                  Start Contributing
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/dashboard">
                  View Dashboard
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <QuickPreviewDrawer
        resource={previewResource}
        isOpen={!!previewResource}
        onClose={() => setPreviewResource(null)}
      />
    </div>
  );
}