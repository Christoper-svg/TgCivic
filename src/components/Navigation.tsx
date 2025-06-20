import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Menu,
  FileText,
  Search,
  BarChart3,
  MessageCircle,
  Phone,
  Building2,
  LogIn,
  LogOut,
  User,
  Settings,
  UserPlus,
  ChevronDown,
  Sparkles,
  Bell,
  Shield,
  Gift,
} from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
}

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const { language, setLanguage, t } = useLanguage();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems: NavItem[] = [
    {
      href: "/",
      label: t("home"),
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      href: "/register-complaint",
      label: t("register_complaint"),
      icon: <FileText className="w-4 h-4" />,
    },
    {
      href: "/track-complaint",
      label: t("track_complaint"),
      icon: <Search className="w-4 h-4" />,
    },
    {
      href: "/schemes",
      label: t("schemes"),
      icon: <Gift className="w-4 h-4" />,
    },
    {
      href: "/dashboard",
      label: t("dashboard"),
      icon: <BarChart3 className="w-4 h-4" />,
      badge: user?.role === "admin" ? 5 : undefined,
    },
  ];

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <>
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-lg"
            : "bg-white/95 backdrop-blur-md border-b border-gray-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo with Animation */}
            <Link
              to="/"
              className="flex items-center space-x-4 group"
              onMouseEnter={() => setHoveredItem("logo")}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <div
                className={`relative transition-all duration-300 ${
                  hoveredItem === "logo" ? "scale-110 rotate-3" : ""
                }`}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Building2 className="w-7 h-7 text-white" />
                  {hoveredItem === "logo" && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping" />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl opacity-20 blur-lg transition-opacity duration-300 group-hover:opacity-40" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  TG Civic
                </span>
                <span className="text-sm text-gray-600 flex items-center space-x-1">
                  <Sparkles className="w-3 h-3 text-yellow-500" />
                  <span>{t("citizen_services")}</span>
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`relative flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group ${
                    isActiveRoute(item.href)
                      ? "text-blue-600 bg-blue-50 shadow-sm"
                      : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                  }`}
                  onMouseEnter={() => setHoveredItem(item.href)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div
                    className={`transition-transform duration-300 ${
                      hoveredItem === item.href ? "scale-110" : ""
                    }`}
                  >
                    {item.icon}
                  </div>
                  <span className="relative">
                    {item.label}
                    {item.badge && (
                      <span className="absolute -top-2 -right-3 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </span>
                  {isActiveRoute(item.href) && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
                  )}
                  {hoveredItem === item.href && !isActiveRoute(item.href) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl -z-10" />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <div className="hidden sm:block">
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-[140px] h-10 border-gray-200 bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-300">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-lg border border-gray-200">
                    <SelectItem value="en" className="hover:bg-blue-50">
                      🇺🇸 English
                    </SelectItem>
                    <SelectItem value="hi" className="hover:bg-blue-50">
                      🇮🇳 हिंदी
                    </SelectItem>
                    <SelectItem value="te" className="hover:bg-blue-50">
                      🏛️ తెలుగు
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Authentication */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  {/* Notifications */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/notifications")}
                    className="relative hover:bg-gray-100 transition-all duration-300 hover:scale-105"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse font-medium">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </Button>

                  {/* User Info Display - Desktop */}
                  <div className="hidden md:flex flex-col text-right">
                    <span className="text-sm font-semibold text-gray-900">
                      {user?.name}
                    </span>
                    <div className="flex items-center justify-end gap-1">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          user?.role === "admin"
                            ? "bg-red-500"
                            : user?.role === "official"
                              ? "bg-green-500"
                              : "bg-blue-500"
                        }`}
                      />
                      <span className="text-xs text-gray-600 capitalize flex items-center space-x-1">
                        {user?.role === "admin" && (
                          <Shield className="w-3 h-3" />
                        )}
                        <span>{user?.role}</span>
                      </span>
                    </div>
                  </div>

                  {/* User Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="relative h-12 w-12 rounded-full p-0 hover:scale-105 transition-all duration-300"
                      >
                        <Avatar className="h-12 w-12 ring-2 ring-gray-200 hover:ring-blue-300 transition-all duration-300">
                          <AvatarFallback
                            className={`text-white font-bold text-lg ${
                              user?.role === "admin"
                                ? "bg-gradient-to-br from-red-500 to-red-600"
                                : user?.role === "official"
                                  ? "bg-gradient-to-br from-green-500 to-green-600"
                                  : "bg-gradient-to-br from-blue-500 to-blue-600"
                            }`}
                          >
                            {user?.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-64 bg-white/95 backdrop-blur-lg border border-gray-200 shadow-xl"
                      align="end"
                      forceMount
                    >
                      <DropdownMenuLabel className="font-normal p-4">
                        <div className="flex flex-col space-y-2">
                          <p className="text-lg font-semibold leading-none text-gray-900">
                            {user?.name}
                          </p>
                          <p className="text-sm leading-none text-gray-600">
                            {user?.email}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                user?.role === "admin"
                                  ? "bg-red-500"
                                  : user?.role === "official"
                                    ? "bg-green-500"
                                    : "bg-blue-500"
                              }`}
                            />
                            <span className="text-xs font-medium text-gray-700 capitalize bg-gray-100 px-2 py-1 rounded-full">
                              {user?.role}
                            </span>
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => navigate("/profile")}
                        className="hover:bg-blue-50 transition-colors duration-200 cursor-pointer p-3"
                      >
                        <User className="mr-3 h-4 w-4" />
                        <span>{t("profile")}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate("/notifications")}
                        className="hover:bg-blue-50 transition-colors duration-200 cursor-pointer p-3"
                      >
                        <Bell className="mr-3 h-4 w-4" />
                        <span>{t("notifications")}</span>
                        {unreadCount > 0 && (
                          <span className="ml-auto text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                            {unreadCount > 99 ? "99+" : unreadCount}
                          </span>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleLogout}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors duration-200 cursor-pointer p-3"
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        <span>{t("logout")}</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Prominent Logout Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="hidden xl:flex border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-300 hover:scale-105"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {t("logout")}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate("/login")}
                    className="hover:scale-105 transition-all duration-300 hover:shadow-md"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    {t("sign_in")}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => navigate("/register")}
                    className="hidden sm:flex bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 transition-all duration-300 hover:shadow-lg"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    {t("register")}
                  </Button>
                </div>
              )}

              {/* Mobile menu trigger */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden hover:bg-gray-100 transition-all duration-300"
                  >
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[350px] sm:w-[400px] bg-white/95 backdrop-blur-lg"
                >
                  <SheetHeader className="pb-6">
                    <SheetTitle className="flex items-center space-x-3 text-xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <span>TG Civic</span>
                    </SheetTitle>
                    <SheetDescription className="text-left">
                      {t("citizen_services")}
                    </SheetDescription>
                  </SheetHeader>

                  <div className="space-y-6 py-6">
                    {/* Mobile Navigation Links */}
                    <div className="space-y-2">
                      {navItems.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                            isActiveRoute(item.href)
                              ? "text-blue-600 bg-blue-50 shadow-sm"
                              : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                          }`}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                          {item.badge && (
                            <span className="ml-auto w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>

                    {/* Language Selector Mobile */}
                    <div className="pt-4 border-t border-gray-200">
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Language / भाषा / భాష
                      </label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">🇺🇸 English</SelectItem>
                          <SelectItem value="hi">🇮🇳 हिंदी</SelectItem>
                          <SelectItem value="te">🏛️ తెలుగు</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* User Section */}
                    <div className="pt-4 border-t border-gray-200">
                      {isAuthenticated ? (
                        <>
                          {/* User Card */}
                          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 mb-4">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-12 w-12 ring-2 ring-white">
                                <AvatarFallback
                                  className={`text-white font-bold ${
                                    user?.role === "admin"
                                      ? "bg-gradient-to-br from-red-500 to-red-600"
                                      : user?.role === "official"
                                        ? "bg-gradient-to-br from-green-500 to-green-600"
                                        : "bg-gradient-to-br from-blue-500 to-blue-600"
                                  }`}
                                >
                                  {user?.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900">
                                  {user?.name}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {user?.email}
                                </p>
                                <div className="flex items-center gap-1 mt-1">
                                  <div
                                    className={`w-2 h-2 rounded-full ${
                                      user?.role === "admin"
                                        ? "bg-red-500"
                                        : user?.role === "official"
                                          ? "bg-green-500"
                                          : "bg-blue-500"
                                    }`}
                                  />
                                  <span className="text-xs text-gray-600 capitalize">
                                    {user?.role}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Button
                              variant="outline"
                              className="w-full justify-start"
                              onClick={() => {
                                navigate("/profile");
                                setIsOpen(false);
                              }}
                            >
                              <User className="w-4 h-4 mr-3" />
                              {t("profile")}
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full justify-start"
                              onClick={() => {
                                navigate("/notifications");
                                setIsOpen(false);
                              }}
                            >
                              <Bell className="w-4 h-4 mr-3" />
                              {t("notifications")}
                              {unreadCount > 0 && (
                                <span className="ml-auto text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                                  {unreadCount > 99 ? "99+" : unreadCount}
                                </span>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full justify-start border-red-200 text-red-600 hover:bg-red-50"
                              onClick={handleLogout}
                            >
                              <LogOut className="w-4 h-4 mr-3" />
                              {t("logout")}
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-3">
                          <Button
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                            onClick={() => {
                              navigate("/login");
                              setIsOpen(false);
                            }}
                          >
                            <LogIn className="w-4 h-4 mr-2" />
                            Sign In
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                              navigate("/register");
                              setIsOpen(false);
                            }}
                          >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Create Account
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-3">
                        <Button variant="outline" size="sm" className="h-12">
                          <Phone className="w-4 h-4 mb-1" />
                          <span className="text-xs">Support</span>
                        </Button>
                        <Button variant="outline" size="sm" className="h-12">
                          <MessageCircle className="w-4 h-4 mb-1" />
                          <span className="text-xs">Help</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navigation */}
      <div className="h-20" />
    </>
  );
};

export default Navigation;
