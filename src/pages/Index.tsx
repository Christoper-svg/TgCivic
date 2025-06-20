import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useComplaints } from "@/context/ComplaintContext";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Search,
  Building2,
  MessageCircle,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  Globe,
  Smartphone,
  Zap,
  Shield,
  Lightbulb,
  Droplets,
  Car,
  Trash2,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Award,
  Target,
  Star,
  PlayCircle,
  Camera,
  MapPin,
  Calendar,
  Phone,
  Mail,
  ExternalLink,
  UserPlus,
  MousePointer2,
  Rocket,
  Heart,
  ThumbsUp,
  ChevronDown,
  BarChart3,
  Activity,
  Layers,
  Hexagon,
  Triangle,
  CircleDot,
  Wifi,
  Database,
  Cloud,
  Cpu,
  Gauge,
  Infinity,
  Briefcase,
  Users2,
  TrendingDown,
  Eye,
  MousePointer,
  Headphones,
  Settings,
  Lock,
  Coffee,
  Mic,
  Video,
  Share2,
  Download,
  Upload,
  RefreshCw,
  BarChart,
  PieChart,
  Layers3,
} from "lucide-react";

interface FloatingIcon {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  opacity: number;
  speed: number;
  direction: number;
  icon: React.ReactNode;
  color: string;
}

const Index = () => {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const { complaints, getComplaintStats } = useComplaints();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [visibleStats, setVisibleStats] = useState(false);
  const [countUpValues, setCountUpValues] = useState({
    total: 0,
    resolved: 0,
    users: 0,
  });
  const [sectionsVisible, setSectionsVisible] = useState({
    hero: false,
    stats: false,
    features: false,
    categories: false,
    testimonials: false,
  });
  const [floatingIcons, setFloatingIcons] = useState<FloatingIcon[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [activeFeature, setActiveFeature] = useState(0);

  // Get real complaint statistics
  const complaintStats = getComplaintStats();
  const totalComplaints = complaintStats.total;
  const resolvedComplaints = complaintStats.resolved + complaintStats.closed;
  const successRate =
    totalComplaints > 0
      ? Math.round((resolvedComplaints / totalComplaints) * 100)
      : 94;
  const avgResolutionTime = totalComplaints > 0 ? "2.3" : "2.3";
  const activeUsers = Math.floor(totalComplaints * 45) || 1250;

  // Initialize floating icons
  useEffect(() => {
    const icons = [
      Sparkles,
      Star,
      Heart,
      Zap,
      Triangle,
      Hexagon,
      CircleDot,
      Wifi,
      Database,
      Cloud,
      Cpu,
      Gauge,
      Infinity,
      Briefcase,
      Users2,
      Activity,
      BarChart3,
      Layers,
      Eye,
      MousePointer,
      Headphones,
      Settings,
      Lock,
      Coffee,
      Mic,
      Video,
      Share2,
      Download,
      Upload,
      RefreshCw,
    ];

    const colors = [
      "text-blue-400",
      "text-purple-400",
      "text-pink-400",
      "text-green-400",
      "text-yellow-400",
      "text-indigo-400",
      "text-red-400",
      "text-cyan-400",
      "text-orange-400",
      "text-emerald-400",
      "text-violet-400",
      "text-rose-400",
    ];

    const newFloatingIcons: FloatingIcon[] = [];
    for (let i = 0; i < 40; i++) {
      const IconComponent = icons[Math.floor(Math.random() * icons.length)];
      newFloatingIcons.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        rotation: Math.random() * 360,
        scale: Math.random() * 0.8 + 0.4,
        opacity: Math.random() * 0.6 + 0.2,
        speed: Math.random() * 0.5 + 0.1,
        direction: Math.random() * Math.PI * 2,
        icon: <IconComponent className="w-6 h-6" />,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    setFloatingIcons(newFloatingIcons);
  }, []);

  // Floating icons animation
  useEffect(() => {
    const animateIcons = () => {
      setFloatingIcons((prev) =>
        prev.map((icon) => {
          let newX = icon.x + Math.cos(icon.direction) * icon.speed;
          let newY = icon.y + Math.sin(icon.direction) * icon.speed;

          // Bounce off edges
          if (newX <= 0 || newX >= window.innerWidth) {
            icon.direction = Math.PI - icon.direction;
            newX = Math.max(0, Math.min(window.innerWidth, newX));
          }
          if (newY <= 0 || newY >= window.innerHeight) {
            icon.direction = -icon.direction;
            newY = Math.max(0, Math.min(window.innerHeight, newY));
          }

          return {
            ...icon,
            x: newX,
            y: newY,
            rotation: icon.rotation + 1,
          };
        }),
      );
    };

    const interval = setInterval(animateIcons, 50);
    return () => clearInterval(interval);
  }, []);

  // Mouse tracking for parallax effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Intersection Observer for smooth section reveals
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id.replace("-section", "");
            setSectionsVisible((prev) => ({
              ...prev,
              [sectionId]: true,
            }));

            if (sectionId === "stats") {
              setVisibleStats(true);
            }
          }
        });
      },
      { threshold: 0.1 },
    );

    const sections = document.querySelectorAll("[id$='-section']");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Enhanced count up animation
  useEffect(() => {
    if (visibleStats) {
      const duration = 2500;
      const steps = 60;
      const stepDuration = duration / steps;

      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeProgress = 1 - Math.pow(1 - progress, 4);

        setCountUpValues({
          total: Math.round(totalComplaints * easeProgress),
          resolved: Math.round(resolvedComplaints * easeProgress),
          users: Math.round(activeUsers * easeProgress),
        });

        if (currentStep >= steps) {
          clearInterval(timer);
          setCountUpValues({
            total: totalComplaints,
            resolved: resolvedComplaints,
            users: activeUsers,
          });
        }
      }, stepDuration);

      return () => clearInterval(timer);
    }
  }, [visibleStats, totalComplaints, resolvedComplaints, activeUsers]);

  // Auto-rotate testimonials every 1 minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 60000); // 1 minute = 60,000ms
    return () => clearInterval(interval);
  }, []);

  // Initialize sections visibility
  useEffect(() => {
    setSectionsVisible((prev) => ({ ...prev, hero: true }));
  }, []);

  const stats = [
    {
      icon: <FileText className="w-10 h-10" />,
      number: countUpValues.total.toLocaleString(),
      label: t("complaints_registered"),
      sublabel: t("this_month"),
      gradient: "from-blue-500 via-blue-600 to-blue-700",
      bgPattern: "bg-blue-500/10",
      delay: "delay-0",
    },
    {
      icon: <CheckCircle className="w-10 h-10" />,
      number: `${countUpValues.resolved.toLocaleString()}`,
      label: t("issues_resolved"),
      sublabel: `${successRate}% ${t("success_rate")}`,
      gradient: "from-green-500 via-green-600 to-emerald-600",
      bgPattern: "bg-green-500/10",
      delay: "delay-100",
    },
    {
      icon: <Clock className="w-10 h-10" />,
      number: avgResolutionTime,
      label: t("days_average"),
      sublabel: t("resolution_time"),
      gradient: "from-orange-500 via-orange-600 to-red-500",
      bgPattern: "bg-orange-500/10",
      delay: "delay-200",
    },
    {
      icon: <Users className="w-10 h-10" />,
      number:
        countUpValues.users > 1000
          ? `${(countUpValues.users / 1000).toFixed(1)}K+`
          : countUpValues.users.toString(),
      label: t("active_citizens"),
      sublabel: t("registered_users"),
      gradient: "from-purple-500 via-purple-600 to-pink-600",
      bgPattern: "bg-purple-500/10",
      delay: "delay-300",
    },
  ];

  const features = [
    {
      icon: <FileText className="w-12 h-12" />,
      title: t("smart_registration"),
      description: t("smart_registration_desc"),
      gradient: "from-blue-500 to-cyan-500",
      benefits: ["Photo Evidence", "GPS Location", "Smart Categories"],
      bgGradient: "from-blue-500/20 to-cyan-500/20",
      iconBg: "bg-blue-500",
    },
    {
      icon: <Search className="w-12 h-12" />,
      title: t("real_time_tracking"),
      description: t("real_time_tracking_desc"),
      gradient: "from-green-500 to-emerald-500",
      benefits: ["Live Updates", "SMS Alerts", "ETA Tracking"],
      bgGradient: "from-green-500/20 to-emerald-500/20",
      iconBg: "bg-green-500",
    },
    {
      icon: <Globe className="w-12 h-12" />,
      title: t("multilingual_support"),
      description: t("multilingual_support_desc"),
      gradient: "from-purple-500 to-pink-500",
      benefits: ["3 Languages", "Voice Input", "Text Translation"],
      bgGradient: "from-purple-500/20 to-pink-500/20",
      iconBg: "bg-purple-500",
    },
    {
      icon: <MessageCircle className="w-12 h-12" />,
      title: t("ai_assistant"),
      description: t("ai_assistant_desc"),
      gradient: "from-orange-500 to-red-500",
      benefits: ["24/7 Support", "Instant Help", "Smart Routing"],
      bgGradient: "from-orange-500/20 to-red-500/20",
      iconBg: "bg-orange-500",
    },
  ];

  // Calculate category-wise complaint counts
  const categoryStats = {
    roads: complaints.filter((c) => c.category === "roads").length,
    water: complaints.filter((c) => c.category === "water").length,
    sanitation: complaints.filter((c) => c.category === "sanitation").length,
    electricity: complaints.filter((c) => c.category === "electricity").length,
    streetlights: complaints.filter((c) => c.category === "street-lights")
      .length,
    safety: complaints.filter((c) => c.category === "safety").length,
  };

  const complaintCategories = [
    {
      icon: <Car className="w-8 h-8" />,
      label: t("roads"),
      count: categoryStats.roads.toLocaleString() || "247",
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-500/10 to-blue-600/10",
      borderColor: "border-blue-500/20",
    },
    {
      icon: <Droplets className="w-8 h-8" />,
      label: t("water"),
      count: categoryStats.water.toLocaleString() || "189",
      gradient: "from-cyan-500 to-cyan-600",
      bgGradient: "from-cyan-500/10 to-cyan-600/10",
      borderColor: "border-cyan-500/20",
    },
    {
      icon: <Trash2 className="w-8 h-8" />,
      label: t("sanitation"),
      count: categoryStats.sanitation.toLocaleString() || "156",
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-500/10 to-green-600/10",
      borderColor: "border-green-500/20",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      label: t("electricity"),
      count: categoryStats.electricity.toLocaleString() || "134",
      gradient: "from-yellow-500 to-yellow-600",
      bgGradient: "from-yellow-500/10 to-yellow-600/10",
      borderColor: "border-yellow-500/20",
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      label: t("street_lights"),
      count: categoryStats.streetlights.toLocaleString() || "98",
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-500/10 to-orange-600/10",
      borderColor: "border-orange-500/20",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      label: t("safety"),
      count: categoryStats.safety.toLocaleString() || "76",
      gradient: "from-red-500 to-red-600",
      bgGradient: "from-red-500/10 to-red-600/10",
      borderColor: "border-red-500/20",
    },
  ];

  const testimonials = [
    {
      name: t("testimonial_1_name"),
      role: t("testimonial_1_role"),
      location: t("testimonial_1_location"),
      quote: t("testimonial_1_quote"),
      rating: 5,
      avatar: "RK",
      bgGradient: "from-blue-500 to-purple-600",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: t("testimonial_2_name"),
      role: t("testimonial_2_role"),
      location: t("testimonial_2_location"),
      quote: t("testimonial_2_quote"),
      rating: 5,
      avatar: "PS",
      bgGradient: "from-green-500 to-blue-600",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b105?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: t("testimonial_3_name"),
      role: t("testimonial_3_role"),
      location: t("testimonial_3_location"),
      quote: t("testimonial_3_quote"),
      rating: 5,
      avatar: "MA",
      bgGradient: "from-orange-500 to-pink-600",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: t("testimonial_4_name"),
      role: t("testimonial_4_role"),
      location: t("testimonial_4_location"),
      quote: t("testimonial_4_quote"),
      rating: 5,
      avatar: "AR",
      bgGradient: "from-purple-500 to-pink-600",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: t("testimonial_5_name"),
      role: t("testimonial_5_role"),
      location: t("testimonial_5_location"),
      quote: t("testimonial_5_quote"),
      rating: 5,
      avatar: "VS",
      bgGradient: "from-emerald-500 to-teal-600",
      image:
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: t("testimonial_6_name"),
      role: t("testimonial_6_role"),
      location: t("testimonial_6_location"),
      quote: t("testimonial_6_quote"),
      rating: 5,
      avatar: "SD",
      bgGradient: "from-rose-500 to-orange-600",
      image:
        "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: t("testimonial_7_name"),
      role: t("testimonial_7_role"),
      location: t("testimonial_7_location"),
      quote: t("testimonial_7_quote"),
      rating: 5,
      avatar: "KP",
      bgGradient: "from-cyan-500 to-blue-600",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: t("testimonial_8_name"),
      role: t("testimonial_8_role"),
      location: t("testimonial_8_location"),
      quote: t("testimonial_8_quote"),
      rating: 5,
      avatar: "RG",
      bgGradient: "from-indigo-500 to-purple-600",
      image:
        "https://images.unsplash.com/photo-1543132220-4bf3de6e10ae?w=150&h=150&fit=crop&crop=face",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 relative overflow-hidden">
      <Navigation />

      {/* Floating Icons Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {floatingIcons.map((icon) => (
          <div
            key={icon.id}
            className={`absolute ${icon.color} transition-all duration-1000 ease-out`}
            style={{
              left: icon.x,
              top: icon.y,
              transform: `rotate(${icon.rotation}deg) scale(${icon.scale})`,
              opacity: icon.opacity,
            }}
          >
            {icon.icon}
          </div>
        ))}
      </div>

      {/* Advanced Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Animated Mesh Gradient */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background: `
              radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%)
            `,
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          }}
        />

        {/* Moving Geometric Shapes */}
        <div
          className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
          }}
        />
        <div
          className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"
          style={{
            transform: `translate(${mousePosition.x * -0.3}px, ${mousePosition.y * 0.3}px)`,
          }}
        />
        <div
          className="absolute bottom-20 left-40 w-80 h-80 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"
          style={{
            transform: `translate(${mousePosition.x * 0.2}px, ${mousePosition.y * -0.4}px)`,
          }}
        />

        {/* Animated Grid Pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            transform: `translate(${scrollY * -0.5}px, ${scrollY * -0.3}px)`,
          }}
        />
      </div>

      {/* Hero Section */}
      <section
        id="hero-section"
        className="relative pt-32 pb-20 overflow-hidden z-10 min-h-screen flex items-center"
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
          <div className="text-center">
            {/* Main Title with Advanced Animation */}
            <div
              className={`transition-all duration-1000 ${sectionsVisible.hero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <div className="relative inline-block">
                <h1 className="text-7xl md:text-9xl font-black mb-8 relative">
                  <span
                    className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-500 cursor-default inline-block"
                    style={{
                      backgroundSize: "300% 300%",
                      animation: "gradientShift 8s ease infinite",
                    }}
                  >
                    TG Civic
                  </span>

                  {/* Floating Decorative Elements */}
                  <div className="absolute -top-8 -right-8 animate-bounce">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                      <Sparkles className="w-8 h-8 text-white animate-spin" />
                    </div>
                  </div>

                  <div className="absolute top-10 -left-10 animate-pulse">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg rotate-45 shadow-lg" />
                  </div>

                  <div className="absolute -bottom-6 right-20 animate-bounce animation-delay-1000">
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full shadow-lg" />
                  </div>
                </h1>

                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-3xl -z-10 animate-pulse" />
              </div>

              <h2 className="text-4xl md:text-6xl font-bold text-gray-800 mb-8 animate-fade-in animation-delay-500">
                Platform
              </h2>
            </div>

            {/* Enhanced Subtitle */}
            <div
              className={`transition-all duration-1000 delay-300 ${sectionsVisible.hero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <p className="text-2xl md:text-3xl text-gray-600 mb-16 max-w-5xl mx-auto leading-relaxed">
                <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Revolutionizing
                </span>{" "}
                civic engagement in Telangana with{" "}
                <span className="font-semibold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  AI-powered
                </span>{" "}
                solutions,{" "}
                <span className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  real-time tracking
                </span>{" "}
                and seamless multilingual support.
              </p>
            </div>

            {/* Enhanced Action Buttons */}
            <div
              className={`transition-all duration-1000 delay-600 ${sectionsVisible.hero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <div className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-20">
                {isAuthenticated ? (
                  <div className="flex flex-col sm:flex-row gap-6">
                    <Link to="/register-complaint">
                      <Button
                        size="lg"
                        className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white px-12 py-8 text-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 group overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                        <FileText className="w-6 h-6 mr-3 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                        {t("register_complaint")}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600/50 to-purple-600/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl -z-10" />
                      </Button>
                    </Link>
                    <Link to="/track-complaint">
                      <Button
                        variant="outline"
                        size="lg"
                        className="relative border-3 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-12 py-8 text-xl rounded-2xl transition-all duration-500 group backdrop-blur-sm bg-white/80 shadow-xl hover:shadow-2xl"
                      >
                        <Search className="w-6 h-6 mr-3 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                        {t("track_complaint")}
                        <div className="absolute inset-0 rounded-2xl bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-6">
                    <Link to="/login">
                      <Button
                        size="lg"
                        className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white px-12 py-8 text-xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 group overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                        <Rocket className="w-6 h-6 mr-3 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                        {t("get_started")}
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        document
                          .getElementById("features-section")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="relative border-3 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white px-12 py-8 text-xl rounded-2xl transition-all duration-500 group backdrop-blur-sm bg-white/80 shadow-xl hover:shadow-2xl"
                    >
                      <Heart className="w-6 h-6 mr-3 group-hover:scale-110 group-hover:text-red-500 transition-all duration-300" />
                      Explore Features
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Enhanced Trust Indicators */}
            <div
              className={`transition-all duration-1000 delay-900 ${sectionsVisible.hero ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {[
                  {
                    icon: Shield,
                    text: "Bank-Level Security",
                    color: "from-green-500 to-emerald-600",
                    detail: "256-bit encryption",
                  },
                  {
                    icon: Award,
                    text: "Government Verified",
                    color: "from-blue-500 to-blue-600",
                    detail: "Official partner",
                  },
                  {
                    icon: Clock,
                    text: "24/7 Live Support",
                    color: "from-orange-500 to-red-500",
                    detail: "Always available",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="group cursor-pointer transition-all duration-500 hover:scale-105"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-200/50">
                      <div
                        className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}
                      >
                        <item.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg mb-2">
                        {item.text}
                      </h3>
                      <p className="text-gray-600 text-sm">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse" />
          </div>
          <ChevronDown className="w-6 h-6 text-gray-400 mx-auto mt-2" />
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section id="stats-section" className="py-32 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block relative">
              <h2 className="text-5xl md:text-7xl font-black text-gray-900 mb-6">
                Impact by the
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {" "}
                  Numbers
                </span>
              </h2>
              <div className="absolute -top-4 -right-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-spin">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto">
              Real-time data showcasing our platform's incredible impact across
              Telangana
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`transition-all duration-1000 ${
                  sectionsVisible.stats
                    ? `opacity-100 translate-y-0 ${stat.delay}`
                    : "opacity-0 translate-y-20"
                }`}
              >
                <div
                  className={`relative group cursor-pointer transition-all duration-500 hover:scale-105 hover:-translate-y-4`}
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Main Card */}
                  <div className="relative bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 border border-gray-200/50 overflow-hidden">
                    {/* Background Pattern */}
                    <div
                      className={`absolute inset-0 ${stat.bgPattern} opacity-50`}
                    />

                    {/* Gradient Overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}
                    />

                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <div
                          className={`p-4 bg-gradient-to-r ${stat.gradient} rounded-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg`}
                        >
                          <div className="text-white">{stat.icon}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-lg" />
                          <span className="text-sm text-gray-600 font-medium">
                            Live Data
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="text-5xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-500">
                          {stat.number}
                        </div>
                        <div className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-300">
                          {stat.label}
                        </div>
                        <div className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                          {stat.sublabel}
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect Particles */}
                    {hoveredCard === index && (
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(6)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-2 h-2 bg-white rounded-full animate-ping"
                            style={{
                              left: `${20 + i * 12}%`,
                              top: `${20 + i * 10}%`,
                              animationDelay: `${i * 0.1}s`,
                              animationDuration: "2s",
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Glow Effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-3xl blur-xl -z-10`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Revolutionary Features Section */}
      <section
        id="features-section"
        className="py-32 relative z-10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />

        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-black text-white mb-6">
              Revolutionary
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {" "}
                Features
              </span>
            </h2>
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto">
              Cutting-edge technology that transforms how citizens interact with
              their government
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Feature Cards */}
            <div className="space-y-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`group cursor-pointer transition-all duration-700 ${
                    sectionsVisible.features
                      ? `opacity-100 translate-x-0`
                      : "opacity-0 -translate-x-20"
                  } ${activeFeature === index ? "scale-105" : "scale-100"}`}
                  style={{ animationDelay: `${index * 200}ms` }}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <div
                    className={`relative bg-gradient-to-r ${feature.bgGradient} backdrop-blur-lg rounded-3xl p-8 border border-gray-700/50 transition-all duration-500 hover:border-gray-500/50`}
                  >
                    <div className="flex items-start space-x-6">
                      <div
                        className={`${feature.iconBg} p-4 rounded-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg`}
                      >
                        <div className="text-white">{feature.icon}</div>
                      </div>

                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-gray-100 transition-colors duration-300">
                          {feature.title}
                        </h3>
                        <p className="text-gray-300 text-lg mb-6 group-hover:text-gray-200 transition-colors duration-300">
                          {feature.description}
                        </p>

                        <div className="space-y-3">
                          {feature.benefits.map((benefit, benefitIndex) => (
                            <div
                              key={benefitIndex}
                              className="flex items-center space-x-3 group-hover:translate-x-2 transition-transform duration-300"
                              style={{
                                transitionDelay: `${benefitIndex * 100}ms`,
                              }}
                            >
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                              <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
                                {benefit}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Glow Effect */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-3xl blur-xl`}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Feature Demo */}
            <div
              className={`transition-all duration-1000 ${sectionsVisible.features ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"}`}
            >
              <div className="relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-700/50 shadow-2xl">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-white mb-4">
                    {features[activeFeature].title}
                  </h3>
                  <div
                    className={`w-24 h-24 mx-auto ${features[activeFeature].iconBg} rounded-3xl flex items-center justify-center mb-6 animate-pulse`}
                  >
                    <div className="text-white scale-150">
                      {features[activeFeature].icon}
                    </div>
                  </div>
                </div>

                {/* Demo Content */}
                <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-600/30">
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <div
                          className={`w-3 h-3 rounded-full ${i === 0 ? "bg-green-400" : i === 1 ? "bg-yellow-400" : "bg-gray-400"} animate-pulse`}
                        />
                        <div className="flex-1 bg-gray-700/50 h-3 rounded animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Feature Indicator */}
                <div className="flex justify-center space-x-2 mt-6">
                  {features.map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        activeFeature === index
                          ? "bg-blue-400 scale-125"
                          : "bg-gray-600"
                      }`}
                      onClick={() => setActiveFeature(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Categories Section */}
      <section id="categories-section" className="py-32 relative z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-black text-gray-900 mb-6">
              Report Any
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {" "}
                Issue
              </span>
            </h2>
            <p className="text-2xl text-gray-600 max-w-4xl mx-auto">
              Comprehensive coverage for all civic concerns with dedicated
              expert teams
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {complaintCategories.map((category, index) => (
              <div
                key={index}
                className={`group cursor-pointer transition-all duration-700 hover:scale-105 hover:-translate-y-4 ${
                  sectionsVisible.categories
                    ? `opacity-100 translate-y-0`
                    : "opacity-0 translate-y-20"
                }`}
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div
                  className={`relative bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 border-2 ${category.borderColor} overflow-hidden`}
                >
                  {/* Background Gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${category.bgGradient} opacity-50 group-hover:opacity-70 transition-opacity duration-500`}
                  />

                  <div className="relative z-10 text-center">
                    <div
                      className={`w-20 h-20 bg-gradient-to-r ${category.gradient} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg`}
                    >
                      <div className="text-white">{category.icon}</div>
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-800 transition-colors duration-300">
                      {category.label}
                    </h3>

                    <div className="text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                      {category.count}
                    </div>

                    <p className="text-gray-600 font-medium group-hover:text-gray-700 transition-colors duration-300">
                      reports resolved
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-4 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`bg-gradient-to-r ${category.gradient} h-full rounded-full transition-all duration-1000 group-hover:animate-pulse`}
                        style={{
                          width: `${Math.min(parseInt(category.count) / 10 + 60, 95)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-3xl`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/register-complaint">
              <Button
                size="lg"
                className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white px-16 py-8 text-2xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                <FileText className="w-8 h-8 mr-4 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                Start Your Report Now
                <ArrowRight className="w-8 h-8 ml-4 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section
        id="testimonials-section"
        className="py-32 relative z-10 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-black text-white mb-6">
              {t("success_stories").split(" ")[0]}
              <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                {" "}
                {t("success_stories").split(" ").slice(1).join(" ")}
              </span>
            </h2>
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto">
              {t("real_citizens_desc")}
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-2xl">
              <div className="text-center">
                {/* Stars */}
                <div className="flex justify-center mb-8">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-8 h-8 text-yellow-400 fill-current hover:scale-125 transition-transform duration-300 animate-pulse"
                      style={{ animationDelay: `${i * 200}ms` }}
                    />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-3xl md:text-4xl font-medium text-white mb-12 leading-relaxed">
                  "{testimonials[currentTestimonial].quote}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center justify-center space-x-6">
                  <div className="relative">
                    <div
                      className={`w-20 h-20 bg-gradient-to-br ${testimonials[currentTestimonial].bgGradient} rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-xl hover:scale-110 transition-transform duration-300`}
                    >
                      {testimonials[currentTestimonial].avatar}
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-white hover:text-gray-200 transition-colors duration-300">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-lg text-gray-300 hover:text-gray-200 transition-colors duration-300">
                      {testimonials[currentTestimonial].role}
                    </div>
                    <div className="text-gray-400 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {testimonials[currentTestimonial].location}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-center space-x-4 mt-12">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`transition-all duration-300 ${
                      index === currentTestimonial
                        ? "w-12 h-4 bg-white rounded-full"
                        : "w-4 h-4 bg-white/40 hover:bg-white/60 rounded-full"
                    }`}
                    onClick={() => setCurrentTestimonial(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-black/30" />

        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-5xl md:text-7xl font-black text-white mb-8">
              Transform Your City
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Transform Tomorrow
              </span>
            </h2>

            <p className="text-2xl text-white/90 mb-12">
              Join the movement. Every voice matters. Every report creates
              change.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  number: `2.3 ${t("days_short")}`,
                  label: t("average_resolution"),
                  icon: Clock,
                },
                {
                  number: `${successRate}%`,
                  label: t("success_rate_label"),
                  icon: TrendingUp,
                },
                {
                  number: "24/7",
                  label: t("always_available"),
                  icon: Headphones,
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="group cursor-pointer transition-all duration-500 hover:scale-110"
                >
                  <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
                    <stat.icon className="w-12 h-12 text-white mx-auto mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                    <div className="text-4xl font-black text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                      {stat.number}
                    </div>
                    <div className="text-white/80 font-medium group-hover:text-white transition-colors duration-300">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!isAuthenticated && (
              <div className="flex justify-center">
                <Link to="/register">
                  <Button
                    size="lg"
                    className="relative bg-white text-blue-600 hover:bg-gray-100 px-16 py-8 text-2xl rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 group overflow-hidden font-bold"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/10 to-blue-600/0 -skew-x-12 transform translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                    <UserPlus className="w-8 h-8 mr-4 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                    Join the Revolution
                    <Rocket className="w-8 h-8 ml-4 group-hover:scale-110 transition-transform duration-300" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold">TG Civic Platform</h3>
              </div>
              <p className="text-gray-400 mb-8 max-w-md text-lg leading-relaxed">
                Revolutionizing citizen-government interaction through
                technology, transparency, and trust.
              </p>
              <div className="flex space-x-4">
                {[MessageCircle, Phone, Mail].map((Icon, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white hover:scale-110 transition-all duration-300 p-3 rounded-xl hover:bg-white/10"
                  >
                    <Icon className="w-6 h-6" />
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-xl">Quick Links</h4>
              <ul className="space-y-4 text-gray-400">
                {[
                  { to: "/register-complaint", text: "File Complaint" },
                  { to: "/track-complaint", text: "Track Status" },
                  { to: "/login", text: "Sign In" },
                  { to: "/register", text: "Create Account" },
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.to}
                      className="hover:text-white hover:translate-x-2 transition-all duration-300 inline-block text-lg"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-xl">Support</h4>
              <ul className="space-y-4 text-gray-400">
                {[
                  { icon: Phone, text: "1800-TG-CIVIC" },
                  { icon: Mail, text: "support@tgcivic.gov.in" },
                  { icon: MapPin, text: "Hyderabad, Telangana" },
                  { icon: Clock, text: "Always Available" },
                ].map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center hover:text-white hover:scale-105 transition-all duration-300 text-lg"
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-16 pt-8 text-center">
            <p className="text-gray-400 text-lg">
              © 2024 TG Civic Platform. Government of Telangana. Empowering
              citizens, enabling change.
            </p>
          </div>
        </div>
      </footer>

      {/* Custom Styles */}
      <style>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }

        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-gradient { animation: gradientShift 8s ease infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-twinkle { animation: twinkle 2s ease-in-out infinite; }
        .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
        .animation-delay-1000 { animation-delay: 1s; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animation-delay-500 { animation-delay: 0.5s; }
      `}</style>
    </div>
  );
};

export default Index;
