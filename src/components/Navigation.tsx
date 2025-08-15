import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { 
  FileText, 
  Presentation, 
  ScrollText, 
  GraduationCap, 
  Upload,
  BarChart3,
  Bookmark,
  Menu,
  X,
  Users2,
  Bell,
  User,
  LogIn,
  ChevronDown,
  Code,
  Brain
} from "lucide-react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/appStore";

const navItems = [
  { name: "Home", href: "/", icon: GraduationCap },
  { name: "Notes", href: "/notes", icon: FileText },
  { name: "PPTs", href: "/ppts", icon: Presentation },
  { name: "Past Papers", href: "/past-papers", icon: ScrollText },
  { name: "Tutorials", href: "/tutorials", icon: Code },
  { name: "Mock Tests", href: "/mock-tests", icon: BarChart3 },
  { name: "Community", href: "/community", icon: MessageSquare },
];

const secondaryItems = [
  { name: "Classmates", href: "/classmates", icon: Users2 },
  { name: "My Library", href: "/library", icon: Bookmark },
  { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
];

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { unreadCount, currentUser } = useAppStore();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "glass border-b backdrop-blur-lg" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 lg:space-x-3">
            <div className="relative">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-primary rounded-2xl flex items-center justify-center">
                <Brain className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-secondary rounded-full flex items-center justify-center">
                <Code className="w-2 h-2 text-white" />
              </div>
            </div>
            <div className="hidden sm:block">
              <span className="text-lg lg:text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                SCA Resources
              </span>
              <div className="text-xs text-muted-foreground">BCA(AI&ML) Hub</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link key={item.name} to={item.href}>
                  <Button 
                    variant={isActive ? "default" : "ghost"} 
                    size="sm"
                    className={cn(
                      "flex items-center space-x-2 font-medium transition-all duration-200",
                      isActive && "bg-primary/10 text-primary hover:bg-primary/20"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden xl:inline">{item.name}</span>
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            {/* Upload Button */}
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="hidden sm:flex items-center space-x-2"
            >
              <Link to="/upload">
                <Upload className="w-4 h-4" />
                <span className="hidden md:inline">Upload</span>
              </Link>
            </Button>

            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
              className="relative"
            >
              <Link to="/notifications">
                <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0"
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hidden lg:flex items-center space-x-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={currentUser?.avatar} />
                    <AvatarFallback>
                      <User className="w-3 h-3" />
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {currentUser ? (
                  <>
                    <div className="px-2 py-1.5 text-sm">
                      <div className="font-medium">{currentUser.name}</div>
                      <div className="text-xs text-muted-foreground">{currentUser.course}</div>
                    </div>
                    <DropdownMenuSeparator />
                    {secondaryItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <DropdownMenuItem key={item.name} asChild>
                          <Link to={item.href} className="flex items-center space-x-2">
                            <Icon className="w-4 h-4" />
                            <span>{item.name}</span>
                          </Link>
                        </DropdownMenuItem>
                      );
                    })}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <LogIn className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/login" className="flex items-center space-x-2">
                        <LogIn className="w-4 h-4" />
                        <span>Login</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/register" className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>Register</span>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden border-t glass"
            >
              <div className="py-4 space-y-1">
                {/* Primary Navigation */}
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  
                  return (
                    <Link 
                      key={item.name} 
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button 
                        variant={isActive ? "default" : "ghost"} 
                        className={cn(
                          "w-full justify-start space-x-3",
                          isActive && "bg-primary/10 text-primary"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </Button>
                    </Link>
                  );
                })}
                
                {/* Divider */}
                <div className="border-t my-2" />
                
                {/* Secondary Navigation */}
                {secondaryItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.href;
                  
                  return (
                    <Link 
                      key={item.name} 
                      to={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Button 
                        variant={isActive ? "default" : "ghost"} 
                        className={cn(
                          "w-full justify-start space-x-3",
                          isActive && "bg-primary/10 text-primary"
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </Button>
                    </Link>
                  );
                })}

                {/* Upload Button for Mobile */}
                <Link to="/upload" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start space-x-3">
                    <Upload className="w-4 h-4" />
                    <span>Upload Resource</span>
                  </Button>
                </Link>

                {/* User Actions for Mobile */}
                <div className="border-t my-2" />
                {currentUser ? (
                  <div className="px-3 py-2">
                    <div className="text-sm font-medium">{currentUser.name}</div>
                    <div className="text-xs text-muted-foreground">{currentUser.course}</div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start space-x-3">
                        <LogIn className="w-4 h-4" />
                        <span>Login</span>
                      </Button>
                    </Link>
                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start space-x-3">
                        <User className="w-4 h-4" />
                        <span>Register</span>
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};