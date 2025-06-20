import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Building2,
  Shield,
  Edit,
  Save,
  X,
  Home,
  Clock,
  CheckCircle,
  Activity,
  Settings,
  Key,
  UserCheck,
  Info,
  ArrowLeft,
  Trash2,
  Download,
  Upload,
} from "lucide-react";
import Navigation from "@/components/Navigation";

const Profile = () => {
  const { user, isAuthenticated, updateProfile, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    department: user?.department || "",
  });
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Redirect if not authenticated
  if (!isAuthenticated || !user) {
    navigate("/login");
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200";
      case "official":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="w-4 h-4" />;
      case "official":
        return <Building2 className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form when canceling
      setEditForm({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        department: user?.department || "",
      });
    }
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    // Update user profile
    updateProfile({
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
      department: editForm.department,
    });
    setIsEditing(false);
    setUpdateSuccess(true);

    // Hide success message after 3 seconds
    setTimeout(() => setUpdateSuccess(false), 3000);
  };

  const handleDeleteAccount = () => {
    // In a real app, this would call an API to delete the account
    logout();
    navigate("/");
  };

  const exportUserData = () => {
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      department: user.department,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    };

    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tg-civic-profile-${user.id}.json`;
    link.click();
  };

  const getAccountAge = () => {
    const createdDate = new Date(user.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} day${diffDays !== 1 ? "s" : ""}`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months !== 1 ? "s" : ""}`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years !== 1 ? "s" : ""}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div className="mb-4 sm:mb-0">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-4 text-gray-600 hover:text-gray-900 -ml-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Profile Settings
            </h1>
            <p className="text-gray-600">
              Manage your account information and preferences
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportUserData}
              className="text-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Success Alert */}
        {updateSuccess && (
          <Alert className="mb-6 border-green-200 bg-green-50">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Profile updated successfully!
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Overview Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader className="text-center pb-6">
                <div className="flex justify-center mb-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24 ring-4 ring-white shadow-lg">
                      <AvatarFallback
                        className={`text-white font-bold text-2xl ${
                          user.role === "admin"
                            ? "bg-gradient-to-br from-red-500 to-red-600"
                            : user.role === "official"
                              ? "bg-gradient-to-br from-green-500 to-green-600"
                              : "bg-gradient-to-br from-blue-500 to-blue-600"
                        }`}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-3 border-white rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-gray-900">
                  {user.name}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {user.email}
                </CardDescription>
                <div className="flex justify-center mt-3">
                  <Badge
                    className={`${getRoleColor(user.role)} text-sm px-3 py-1`}
                  >
                    {getRoleIcon(user.role)}
                    <span className="ml-2 capitalize">{user.role}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Member since</span>
                    <span className="font-medium text-gray-900">
                      {getAccountAge()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Last login</span>
                    <span className="font-medium text-gray-900">
                      {formatDate(user.lastLogin).split(",")[0]}
                    </span>
                  </div>
                  {user.department && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Department</span>
                      <span className="font-medium text-gray-900">
                        {user.department}
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex items-center justify-center text-xs text-gray-500">
                    <UserCheck className="w-3 h-3 mr-1" />
                    Verified Account
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal details and contact information
                  </CardDescription>
                </div>
                <Button
                  variant={isEditing ? "outline" : "default"}
                  size="sm"
                  onClick={handleEditToggle}
                >
                  {isEditing ? (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-700"
                    >
                      Full Name
                    </Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        className="mt-1"
                      />
                    ) : (
                      <div className="mt-1 flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{user.name}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                        className="mt-1"
                      />
                    ) : (
                      <div className="mt-1 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{user.email}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="phone"
                      className="text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={editForm.phone}
                        onChange={(e) =>
                          setEditForm({ ...editForm, phone: e.target.value })
                        }
                        className="mt-1"
                      />
                    ) : (
                      <div className="mt-1 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{user.phone}</span>
                      </div>
                    )}
                  </div>

                  {(user.role === "admin" || user.role === "official") && (
                    <div>
                      <Label
                        htmlFor="department"
                        className="text-sm font-medium text-gray-700"
                      >
                        Department
                      </Label>
                      {isEditing ? (
                        <Input
                          id="department"
                          value={editForm.department}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              department: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      ) : (
                        <div className="mt-1 flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">
                            {user.department || "Not specified"}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button variant="outline" onClick={handleEditToggle}>
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Account Details
                </CardTitle>
                <CardDescription>
                  View your account information and activity
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        User ID
                      </Label>
                      <div className="mt-1 flex items-center gap-2">
                        <Key className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 font-mono text-sm">
                          {user.id}
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Account Type
                      </Label>
                      <div className="mt-1 flex items-center gap-2">
                        {getRoleIcon(user.role)}
                        <span className="text-gray-900 capitalize">
                          {user.role}
                        </span>
                        <Badge variant="outline" className="ml-2 text-xs">
                          {user.role === "admin"
                            ? "Full Access"
                            : user.role === "official"
                              ? "Limited Access"
                              : "Standard Access"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Account Created
                      </Label>
                      <div className="mt-1 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">
                          {formatDate(user.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Last Login
                      </Label>
                      <div className="mt-1 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">
                          {formatDate(user.lastLogin)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
                <CardDescription>
                  Common account management tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/notifications")}
                    className="justify-start h-12"
                  >
                    <Activity className="w-4 h-4 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Notifications</div>
                      <div className="text-xs text-gray-500">Manage alerts</div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => navigate("/dashboard")}
                    className="justify-start h-12"
                    disabled={user.role === "citizen"}
                  >
                    <Activity className="w-4 h-4 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Dashboard</div>
                      <div className="text-xs text-gray-500">
                        {user.role === "citizen"
                          ? "Not available"
                          : "View stats"}
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => navigate("/register-complaint")}
                    className="justify-start h-12"
                  >
                    <Home className="w-4 h-4 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">New Complaint</div>
                      <div className="text-xs text-gray-500">
                        Register issue
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => navigate("/track-complaint")}
                    className="justify-start h-12"
                  >
                    <CheckCircle className="w-4 h-4 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Track Complaints</div>
                      <div className="text-xs text-gray-500">View status</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Account Security */}
            <Card className="border-red-200 bg-red-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-900">
                  <Shield className="w-5 h-5" />
                  Account Security
                </CardTitle>
                <CardDescription className="text-red-700">
                  Manage your account security and data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert className="border-amber-200 bg-amber-50">
                    <Info className="w-4 h-4 text-amber-600" />
                    <AlertDescription className="text-amber-800">
                      For security reasons, password changes are not available
                      in this demo. In a real application, users would be able
                      to change their password here.
                    </AlertDescription>
                  </Alert>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      variant="outline"
                      onClick={exportUserData}
                      className="flex-1 justify-start"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export My Data
                    </Button>

                    <AlertDialog
                      open={showDeleteDialog}
                      onOpenChange={setShowDeleteDialog}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex-1 justify-start border-red-300 text-red-700 hover:bg-red-100"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete Account
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Account</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete your account? This
                            action cannot be undone. All your data, including
                            complaints and history, will be permanently removed.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
