import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  LogIn,
  Eye,
  EyeOff,
  Building2,
  Mail,
  Lock,
  AlertCircle,
  User,
  Shield,
  Users,
  ArrowLeft,
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Get the intended destination from location state
  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    const success = await login(formData.email, formData.password);

    if (success) {
      navigate(from, { replace: true });
    } else {
      setError("Invalid email or password");
    }
  };

  const demoAccounts = [
    {
      role: "Admin",
      email: "admin@tgcivic.gov.in",
      password: "admin123",
      description: "Full access to dashboard and management",
      icon: <Shield className="w-4 h-4" />,
      color: "bg-red-100 text-red-800",
    },
    {
      role: "Citizen",
      email: "rajesh@email.com",
      password: "citizen123",
      description: "Register and track complaints",
      icon: <User className="w-4 h-4" />,
      color: "bg-blue-100 text-blue-800",
    },
    {
      role: "Official",
      email: "officer@ghmc.gov.in",
      password: "official123",
      description: "Manage assigned complaints",
      icon: <Users className="w-4 h-4" />,
      color: "bg-green-100 text-green-800",
    },
  ];

  const fillDemoCredentials = (email: string, password: string) => {
    setFormData({ email, password });
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back Button */}
        <div className="flex justify-start">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-gray-600 hover:text-gray-900 -ml-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center">
              <Building2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">
            Sign in to access TG Civic services
          </p>
        </div>

        {/* Demo Accounts */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-blue-900">
              Demo Accounts
            </CardTitle>
            <CardDescription className="text-blue-700">
              Click to auto-fill credentials
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {demoAccounts.map((account, index) => (
              <div
                key={index}
                onClick={() =>
                  fillDemoCredentials(account.email, account.password)
                }
                className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200 cursor-pointer hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-1.5 rounded-md ${account.color}`}>
                    {account.icon}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {account.role}
                    </p>
                    <p className="text-xs text-gray-600">
                      {account.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-mono text-gray-600">
                    {account.email}
                  </p>
                  <p className="text-xs font-mono text-gray-500">
                    {account.password}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogIn className="w-5 h-5" />
              Sign In
            </CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Register here
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-gray-600">
          <p>© 2024 TG Civic - Government of Telangana</p>
          <div className="flex justify-center space-x-4 mt-2">
            <Link to="/" className="hover:text-blue-600">
              Home
            </Link>
            <span>•</span>
            <Link to="/help" className="hover:text-blue-600">
              Help
            </Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-blue-600">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
