import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Brain,
  Code,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Youtube,
  BookOpen,
  Users,
  Award,
  TrendingUp,
  Download,
  Upload,
  MessageSquare,
  Bell,
  ExternalLink,
  Heart,
  ArrowUp
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const footerLinks = {
  academics: [
    { name: 'BCA Course', href: '/course/bca' },
    { name: 'AI & ML Specialization', href: '/course/ai-ml' },
    { name: 'Syllabus', href: '/syllabus' },
    { name: 'Academic Calendar', href: '/calendar' },
    { name: 'Examination', href: '/exams' }
  ],
  resources: [
    { name: 'Study Notes', href: '/notes' },
    { name: 'Presentations', href: '/ppts' },
    { name: 'Past Papers', href: '/past-papers' },
    { name: 'Video Tutorials', href: '/tutorials' },
    { name: 'Mock Tests', href: '/mock-tests' }
  ],
  community: [
    { name: 'Student Forum', href: '/community' },
    { name: 'Find Classmates', href: '/classmates' },
    { name: 'Study Groups', href: '/study-groups' },
    { name: 'Events', href: '/events' },
    { name: 'Alumni Network', href: '/alumni' }
  ],
  support: [
    { name: 'Help Center', href: '/help' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Report Issue', href: '/report' },
    { name: 'Feedback', href: '/feedback' },
    { name: 'FAQ', href: '/faq' }
  ]
};

const socialLinks = [
  { name: 'Facebook', icon: Facebook, href: '#', color: 'hover:text-blue-500' },
  { name: 'Twitter', icon: Twitter, href: '#', color: 'hover:text-sky-500' },
  { name: 'Instagram', icon: Instagram, href: '#', color: 'hover:text-pink-500' },
  { name: 'LinkedIn', icon: Linkedin, href: '#', color: 'hover:text-blue-600' },
  { name: 'GitHub', icon: Github, href: '#', color: 'hover:text-gray-600' },
  { name: 'YouTube', icon: Youtube, href: '#', color: 'hover:text-red-500' }
];

const stats = [
  { icon: BookOpen, label: 'Resources', value: '5,180+' },
  { icon: Users, label: 'BCA Students', value: '12,000+' },
  { icon: Download, label: 'Downloads', value: '45,000+' },
  { icon: Award, label: 'Universities', value: '50+' }
];

export const Footer = () => {
  const [email, setEmail] = React.useState('');

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Newsletter subscription:', email);
    setEmail('');
  };

  return (
    <footer className="relative bg-background border-t">
      {/* Stats Section */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-foreground">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-primary rounded-2xl flex items-center justify-center">
                  <Brain className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-secondary rounded-full flex items-center justify-center">
                  <Code className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <div>
                <div className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  SCA Resources
                </div>
                <div className="text-sm text-muted-foreground">BCA(AI&ML) Hub</div>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Your comprehensive platform for BCA(AI&ML) resources. Connect with fellow students, 
              access study materials, and excel in your academic journey at School of Computer Application.
            </p>

            {/* Newsletter Signup */}
            <div className="mb-6">
              <h4 className="font-semibold mb-3 flex items-center">
                <Bell className="w-4 h-4 mr-2" />
                Stay Updated
              </h4>
              <form onSubmit={handleNewsletter} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button type="submit" size="sm">
                  Subscribe
                </Button>
              </form>
            </div>

            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <Button
                    key={social.name}
                    variant="ghost"
                    size="sm"
                    asChild
                    className={`transition-colors ${social.color}`}
                  >
                    <a href={social.href} target="_blank" rel="noopener noreferrer">
                      <Icon className="w-4 h-4" />
                    </a>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Academics */}
              <div>
                <h3 className="font-semibold text-foreground mb-4 flex items-center">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Academics
                </h3>
                <ul className="space-y-3">
                  {footerLinks.academics.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center group"
                      >
                        {link.name}
                        <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className="font-semibold text-foreground mb-4 flex items-center">
                  <Upload className="w-4 h-4 mr-2" />
                  Resources
                </h3>
                <ul className="space-y-3">
                  {footerLinks.resources.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center group"
                      >
                        {link.name}
                        <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Community */}
              <div>
                <h3 className="font-semibold text-foreground mb-4 flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Community
                </h3>
                <ul className="space-y-3">
                  {footerLinks.community.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center group"
                      >
                        {link.name}
                        <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="font-semibold text-foreground mb-4 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Support
                </h3>
                <ul className="space-y-3">
                  {footerLinks.support.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-muted-foreground hover:text-primary transition-colors text-sm flex items-center group"
                      >
                        {link.name}
                        <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="border-t bg-muted/20">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>School of Computer Application, University Campus</span>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-2 text-sm text-muted-foreground">
              <Phone className="w-4 h-4" />
              <span>+91 12345 67890</span>
            </div>
            <div className="flex items-center justify-center md:justify-start space-x-2 text-sm text-muted-foreground">
              <Mail className="w-4 h-4" />
              <span>info@sca-resources.edu</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
            <div className="text-sm text-muted-foreground">
              © 2024 SCA Resources. Built with{' '}
              <Heart className="w-3 h-3 inline text-red-500" />{' '}
              by BCA(AI&ML) students for BCA students.
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Separator orientation="vertical" className="h-4" />
              <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Separator orientation="vertical" className="h-4" />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleScrollToTop}
                className="text-muted-foreground hover:text-primary"
              >
                <ArrowUp className="w-4 h-4" />
                Back to Top
              </Button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};