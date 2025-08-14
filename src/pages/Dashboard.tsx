import { useState } from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Upload,
  Eye,
  Star,
  Users,
  FileText,
  Calendar,
  Activity,
  Award,
  Target
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const statsCards = [
  {
    title: "Total Uploads",
    value: "24",
    change: "+12%",
    trend: "up",
    icon: Upload,
    color: "from-blue-500 to-blue-600"
  },
  {
    title: "Total Downloads",
    value: "1,247",
    change: "+18%",
    trend: "up",
    icon: Download,
    color: "from-green-500 to-green-600"
  },
  {
    title: "Profile Views",
    value: "3,892",
    change: "+23%",
    trend: "up",
    icon: Eye,
    color: "from-purple-500 to-purple-600"
  },
  {
    title: "Average Rating",
    value: "4.8",
    change: "+0.2",
    trend: "up",
    icon: Star,
    color: "from-yellow-500 to-yellow-600"
  }
];

const recentUploads = [
  {
    id: 1,
    title: "Advanced Data Structures Notes",
    type: "notes",
    downloads: 156,
    rating: 4.9,
    upload_date: "2024-01-20",
    status: "approved",
    views: 892
  },
  {
    id: 2,
    title: "Machine Learning Presentation",
    type: "ppt",
    downloads: 203,
    rating: 4.7,
    upload_date: "2024-01-18",
    status: "approved",
    views: 1204
  },
  {
    id: 3,
    title: "Database Design Past Paper",
    type: "paper",
    downloads: 89,
    rating: 4.8,
    upload_date: "2024-01-15",
    status: "pending",
    views: 432
  },
  {
    id: 4,
    title: "React Tutorial Series",
    type: "tutorial",
    downloads: 312,
    rating: 4.9,
    upload_date: "2024-01-12",
    status: "approved",
    views: 1567
  }
];

const achievements = [
  {
    id: 1,
    title: "First Upload",
    description: "Uploaded your first resource",
    icon: Upload,
    earned: true,
    date: "2024-01-10"
  },
  {
    id: 2,
    title: "Popular Contributor",
    description: "Reached 1000+ total downloads",
    icon: TrendingUp,
    earned: true,
    date: "2024-01-15"
  },
  {
    id: 3,
    title: "Quality Creator",
    description: "Maintain 4.5+ average rating",
    icon: Star,
    earned: true,
    date: "2024-01-18"
  },
  {
    id: 4,
    title: "Top Contributor",
    description: "Upload 50+ resources",
    icon: Award,
    earned: false,
    progress: 48
  }
];

const activityData = [
  { date: "2024-01-20", type: "upload", title: "Advanced Data Structures Notes" },
  { date: "2024-01-19", type: "achievement", title: "Quality Creator badge earned" },
  { date: "2024-01-18", type: "upload", title: "Machine Learning Presentation" },
  { date: "2024-01-17", type: "milestone", title: "1000+ downloads reached" },
  { date: "2024-01-15", type: "upload", title: "Database Design Past Paper" }
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "upload": return Upload;
      case "achievement": return Award;
      case "milestone": return Target;
      default: return Activity;
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
            Dashboard
          </h1>
          <p className="text-xl text-muted-foreground">
            Track your contributions and engagement
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                whileHover={{ y: -5 }}
              >
                <Card className="p-6 glass border-white/20 hover:border-white/40 transition-all duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant={stat.trend === "up" ? "default" : "secondary"} className="bg-green-100 text-green-800">
                      {stat.change}
                    </Badge>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Dashboard Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 glass border border-white/20 mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="uploads">My Uploads</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Uploads */}
                <Card className="p-6 glass border-white/20">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">Recent Uploads</h3>
                    <Button variant="outline" size="sm">
                      View All
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {recentUploads.slice(0, 3).map(upload => (
                      <div key={upload.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-xl">
                        <div className="flex-1">
                          <h4 className="font-medium mb-1">{upload.title}</h4>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Download className="w-3 h-3" />
                              {upload.downloads}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              {upload.rating}
                            </span>
                          </div>
                        </div>
                        <Badge className={getStatusColor(upload.status)}>
                          {upload.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Quick Actions */}
                <Card className="p-6 glass border-white/20">
                  <h3 className="text-xl font-bold mb-6">Quick Actions</h3>
                  <div className="space-y-4">
                    <Button variant="hero" className="w-full justify-start" size="lg">
                      <Upload className="w-5 h-5" />
                      Upload New Resource
                    </Button>
                    <Button variant="outline" className="w-full justify-start" size="lg">
                      <BarChart3 className="w-5 h-5" />
                      View Analytics
                    </Button>
                    <Button variant="outline" className="w-full justify-start" size="lg">
                      <Users className="w-5 h-5" />
                      Manage Profile
                    </Button>
                    <Button variant="outline" className="w-full justify-start" size="lg">
                      <FileText className="w-5 h-5" />
                      Browse Library
                    </Button>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="uploads" className="space-y-6">
              <Card className="glass border-white/20">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">All Uploads ({recentUploads.length})</h3>
                    <Button variant="hero">
                      <Upload className="w-4 h-4" />
                      Upload New
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {recentUploads.map(upload => (
                      <div key={upload.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-xl hover:bg-muted/30 transition-colors">
                        <div className="flex-1">
                          <h4 className="font-medium mb-2">{upload.title}</h4>
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Download className="w-4 h-4" />
                              {upload.downloads} downloads
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {upload.views} views
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              {upload.rating}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {upload.upload_date}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getStatusColor(upload.status)}>
                            {upload.status}
                          </Badge>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="achievements" className="space-y-6">
              <Card className="p-6 glass border-white/20">
                <h3 className="text-xl font-bold mb-6">Achievements & Badges</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map(achievement => {
                    const Icon = achievement.icon;
                    return (
                      <div 
                        key={achievement.id} 
                        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                          achievement.earned 
                            ? "border-primary bg-primary/5" 
                            : "border-dashed border-muted-foreground/30 bg-muted/20"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                            achievement.earned 
                              ? "bg-primary text-white" 
                              : "bg-muted text-muted-foreground"
                          }`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium mb-1">{achievement.title}</h4>
                            <p className="text-sm text-muted-foreground mb-2">
                              {achievement.description}
                            </p>
                            {achievement.earned ? (
                              <Badge variant="default" className="bg-green-100 text-green-800">
                                Earned {achievement.date}
                              </Badge>
                            ) : achievement.progress ? (
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Progress</span>
                                  <span>{achievement.progress}/50</span>
                                </div>
                                <Progress value={(achievement.progress / 50) * 100} />
                              </div>
                            ) : (
                              <Badge variant="secondary">
                                Not Earned
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card className="p-6 glass border-white/20">
                <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  {activityData.map((activity, index) => {
                    const Icon = getTypeIcon(activity.type);
                    return (
                      <div key={index} className="flex items-center gap-4 p-3 bg-muted/20 rounded-xl">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">{activity.date}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}