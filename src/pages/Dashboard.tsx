import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useComplaints } from "@/context/ComplaintContext";
import { useNotifications } from "@/context/NotificationContext";
import { useSchemes } from "@/context/SchemesContext";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  TrendingUp,
  Clock,
  Star,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle,
  Settings,
  Filter,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2,
  ArrowUpRight,
} from "lucide-react";
import { AdminSchemeModal } from "@/components/AdminSchemeModal";

const Dashboard = () => {
  const { user } = useAuth();
  const { complaints, getComplaintStats } = useComplaints();
  const { notifications, unreadCount } = useNotifications();
  const {
    schemes,
    getTotalViews,
    getMostViewedScheme,
    getAllCategories,
    updateScheme,
    deleteScheme,
    addScheme,
    getSchemeById,
  } = useSchemes();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedScheme, setSelectedScheme] = useState<any>(null);
  const [isSchemeModalOpen, setIsSchemeModalOpen] = useState(false);
  const [schemeModalMode, setSchemeModalMode] = useState<
    "view" | "edit" | "create"
  >("view");

  const handleViewScheme = (scheme: any) => {
    setSelectedScheme(scheme);
    setSchemeModalMode("view");
    setIsSchemeModalOpen(true);
  };

  const handleEditScheme = (scheme: any) => {
    setSelectedScheme(scheme);
    setSchemeModalMode("edit");
    setIsSchemeModalOpen(true);
  };

  const handleCreateScheme = () => {
    setSelectedScheme(null);
    setSchemeModalMode("create");
    setIsSchemeModalOpen(true);
  };

  const handleSaveScheme = (schemeData: any) => {
    if (schemeModalMode === "create") {
      addScheme(schemeData);
    } else if (schemeModalMode === "edit" && selectedScheme) {
      updateScheme(selectedScheme.id, schemeData);
    }
    setIsSchemeModalOpen(false);
  };

  const handleDeleteScheme = (schemeId: string) => {
    deleteScheme(schemeId);
    setIsSchemeModalOpen(false);
  };

  // Redirect non-admin users
  if (!user || user.userType !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600">
            This page is only accessible to admin users.
          </p>
        </div>
      </div>
    );
  }

  const stats = getComplaintStats();

  // Calculate additional metrics
  const totalComplaints = stats.total;
  const resolvedComplaints = stats.resolved + stats.closed;
  const resolutionRate =
    totalComplaints > 0
      ? Math.round((resolvedComplaints / totalComplaints) * 100)
      : 0;
  const avgResolutionTime = 3.2; // Mock data
  const userSatisfaction = 4.8; // Mock data

  // Category distribution data
  const categoryData = [
    { name: "Roads", count: 156, color: "bg-blue-500", percentage: 42 },
    { name: "Water", count: 134, color: "bg-green-500", percentage: 36 },
    { name: "Sanitation", count: 67, color: "bg-yellow-500", percentage: 18 },
    { name: "Electricity", count: 45, color: "bg-orange-500", percentage: 12 },
    { name: "Street Lights", count: 23, color: "bg-purple-500", percentage: 6 },
  ];

  // Schemes data from context
  const topScheme = getMostViewedScheme();
  const schemesData = {
    totalSchemes: schemes.length,
    totalViews: getTotalViews(),
    topScheme: topScheme?.name || "N/A",
    topSchemeViews: topScheme?.views || 0,
    categories: getAllCategories().length,
  };

  const allSchemes = schemes.slice(0, 3); // Show top 3 schemes

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="pt-20">
        {" "}
        {/* Account for fixed navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Complete platform management and oversight
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                Administrator Access
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-5 bg-white">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="complaints"
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Complaints
              </TabsTrigger>
              <TabsTrigger value="schemes" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Schemes
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Users
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="flex items-center gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                Notifications
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <h3 className="text-sm font-medium text-gray-600 mb-2">
                        Resolution Rate
                      </h3>
                      <div className="text-4xl font-bold text-green-600 mb-1">
                        {resolutionRate}%
                      </div>
                      <p className="text-xs text-gray-500">
                        Average resolution rate this month
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <h3 className="text-sm font-medium text-gray-600 mb-2">
                        Avg Resolution Time
                      </h3>
                      <div className="text-4xl font-bold text-blue-600 mb-1">
                        {avgResolutionTime}
                      </div>
                      <p className="text-xs text-gray-500">Days on average</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <h3 className="text-sm font-medium text-gray-600 mb-2">
                        User Satisfaction
                      </h3>
                      <div className="text-4xl font-bold text-yellow-600 mb-1">
                        {userSatisfaction}★
                      </div>
                      <p className="text-xs text-gray-500">Average rating</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Category Distribution */}
              <Card className="bg-white border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Category Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {categoryData.map((category, index) => (
                    <div key={category.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">
                          {category.name}
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          {category.count}
                        </span>
                      </div>
                      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`absolute top-0 left-0 h-full ${category.color} rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: `${category.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Schemes Tab */}
            <TabsContent value="schemes" className="space-y-6">
              {/* Scheme Manager Header */}
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Scheme Manager
                  </h2>
                  <p className="text-gray-600">
                    Manage government schemes and track their performance
                  </p>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Scheme
                </Button>
              </div>

              {/* Scheme Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Schemes</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {schemesData.totalSchemes}
                        </p>
                        <p className="text-xs text-gray-500">
                          Active government schemes
                        </p>
                      </div>
                      <Settings className="w-5 h-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Views</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {schemesData.totalViews}
                        </p>
                        <p className="text-xs text-gray-500">
                          Schemes page views
                        </p>
                      </div>
                      <Eye className="w-5 h-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Top Scheme</p>
                        <p className="text-lg font-bold text-gray-900">
                          {schemesData.topScheme}
                        </p>
                        <p className="text-xs text-gray-500">
                          {schemesData.topSchemeViews} views
                        </p>
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Categories</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {schemesData.categories}
                        </p>
                        <p className="text-xs text-gray-500">
                          Different categories
                        </p>
                      </div>
                      <Filter className="w-5 h-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* All Schemes Table */}
              <Card className="bg-white">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>All Schemes</CardTitle>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-medium text-gray-700">
                            Scheme Name
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">
                            Category
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">
                            Department
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">
                            Views
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">
                            Status
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-gray-700">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {allSchemes.map((scheme, index) => (
                          <tr
                            key={scheme.id}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="py-4 px-4">
                              <div>
                                <div className="font-medium text-gray-900">
                                  {scheme.name}
                                </div>
                                <div className="text-sm text-gray-500 max-w-md truncate">
                                  {scheme.description}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                <div className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></div>
                                {scheme.category}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600">
                              {scheme.department}
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600">
                              {scheme.views}
                            </td>
                            <td className="py-4 px-4">
                              <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-800"
                              >
                                {scheme.status}
                              </Badge>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Complaints Tab */}
            <TabsContent value="complaints" className="space-y-6">
              <Card className="bg-white">
                <CardHeader>
                  <CardTitle>Recent Complaints</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {complaints.slice(0, 5).map((complaint) => (
                      <div
                        key={complaint.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {complaint.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {complaint.category} • {complaint.location}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            By {complaint.name} • {complaint.id}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge
                            className={
                              complaint.priority === "high"
                                ? "bg-red-100 text-red-800"
                                : complaint.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                            }
                          >
                            {complaint.priority}
                          </Badge>
                          <Badge variant="outline">{complaint.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Other tabs content would be implemented similarly */}
            <TabsContent value="analytics">
              <Card className="bg-white p-8 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Analytics Dashboard
                </h3>
                <p className="text-gray-600">
                  Detailed analytics and reporting features coming soon.
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card className="bg-white p-8 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  User Management
                </h3>
                <p className="text-gray-600">
                  User administration and management features.
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card className="bg-white p-8 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Notification Center
                </h3>
                <p className="text-gray-600">
                  You have {unreadCount} unread notifications.
                </p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
