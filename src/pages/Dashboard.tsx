import React, { useState } from "react";
import { useComplaints, Complaint } from "@/context/ComplaintContext";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { useSchemes } from "@/context/SchemesContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  BarChart3,
  Users,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Calendar,
  Filter,
  Eye,
  Edit,
  Building2,
  Phone,
  User,
  XCircle,
  Trash2,
  Download,
  Upload,
  Settings,
  Shield,
  Archive,
  RefreshCw,
  Search,
  MoreVertical,
  Gift,
  Plus,
  ExternalLink,
  Save,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const {
    complaints,
    updateComplaintStatus,
    deleteComplaint,
    bulkUpdateStatus,
    deleteResolvedComplaints,
    getComplaintStats,
    getComplaintsByCategory,
  } = useComplaints();
  const { schemes, addScheme, updateScheme, deleteScheme, toggleSchemeStatus } =
    useSchemes();

  // State management
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null,
  );
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showBulkDialog, setBulkDialog] = useState(false);
  const [showCleanupDialog, setShowCleanupDialog] = useState(false);
  const [selectedComplaints, setSelectedComplaints] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Scheme management state
  const [currentTab, setCurrentTab] = useState<"complaints" | "schemes">(
    "complaints",
  );
  const [showSchemeDialog, setShowSchemeDialog] = useState(false);
  const [selectedScheme, setSelectedScheme] = useState<any>(null);
  const [showDeleteSchemeDialog, setShowDeleteSchemeDialog] = useState(false);
  const [schemeForm, setSchemeForm] = useState({
    name: "",
    description: "",
    category: "",
    eligibility: "",
    requiredDocuments: "",
    benefits: "",
    applicationProcess: "",
    applyLink: "",
    department: "",
    validUntil: "",
  });

  // Action form state
  const [actionForm, setActionForm] = useState({
    status: "",
    notes: "",
    assignedTo: "",
    estimatedResolution: "",
  });

  const stats = getComplaintStats();
  const isAdmin = user?.role === "admin";

  const statsData = [
    {
      title: "Total Complaints",
      value: stats.total.toString(),
      change: "+5.2%",
      icon: <FileText className="w-6 h-6" />,
      color: "text-blue-600",
    },
    {
      title: "Resolved",
      value: stats.resolved.toString(),
      change: "+8.1%",
      icon: <CheckCircle className="w-6 h-6" />,
      color: "text-green-600",
    },
    {
      title: "In Progress",
      value: stats.inProgress.toString(),
      change: "-2.3%",
      icon: <Clock className="w-6 h-6" />,
      color: "text-yellow-600",
    },
    {
      title: "Pending",
      value: stats.pending.toString(),
      change: "-12.5%",
      icon: <AlertTriangle className="w-6 h-6" />,
      color: "text-red-600",
    },
  ];

  // Filter complaints
  const filteredComplaints = complaints.filter((complaint) => {
    const statusMatch =
      filterStatus === "all" || complaint.status === filterStatus;
    const priorityMatch =
      filterPriority === "all" || complaint.priority === filterPriority;
    const categoryMatch =
      filterCategory === "all" || complaint.category === filterCategory;
    const searchMatch =
      !searchTerm ||
      complaint.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      complaint.phone.includes(searchTerm);

    return statusMatch && priorityMatch && categoryMatch && searchMatch;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-green-100 text-green-800 border-green-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "assigned":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "pending":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-red-100 text-red-800 border-red-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "assigned":
        return <Users className="w-4 h-4 text-yellow-600" />;
      case "pending":
        return <AlertTriangle className="w-4 h-4 text-orange-600" />;
      case "closed":
        return <XCircle className="w-4 h-4 text-gray-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusDisplayName = (status: string) => {
    switch (status) {
      case "in-progress":
        return "In Progress";
      case "assigned":
        return "Assigned";
      case "pending":
        return "Pending";
      case "resolved":
        return "Resolved";
      case "closed":
        return "Closed";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleComplaintSelect = (complaintId: string, checked: boolean) => {
    if (checked) {
      setSelectedComplaints([...selectedComplaints, complaintId]);
    } else {
      setSelectedComplaints(
        selectedComplaints.filter((id) => id !== complaintId),
      );
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedComplaints(filteredComplaints.map((c) => c.id));
    } else {
      setSelectedComplaints([]);
    }
  };

  const viewComplaintDetails = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setShowDetailsDialog(true);
  };

  const takeAction = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setActionForm({
      status: complaint.status,
      notes: "",
      assignedTo: complaint.assignedTo || "",
      estimatedResolution: complaint.estimatedResolution || "",
    });
    setShowActionDialog(true);
  };

  const deleteComplaintHandler = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedComplaint) {
      deleteComplaint(selectedComplaint.id);
      setShowDeleteDialog(false);
      setSelectedComplaint(null);
    }
  };

  const handleActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    updateComplaintStatus(
      selectedComplaint.id,
      actionForm.status as Complaint["status"],
      actionForm.notes,
      user?.name || "Admin",
      addNotification, // Pass notification callback
    );

    setShowActionDialog(false);
    setActionForm({
      status: "",
      notes: "",
      assignedTo: "",
      estimatedResolution: "",
    });
  };

  const handleBulkAction = (action: string) => {
    if (selectedComplaints.length === 0) return;

    if (action === "delete") {
      selectedComplaints.forEach((id) => deleteComplaint(id));
      setSelectedComplaints([]);
    } else {
      bulkUpdateStatus(
        selectedComplaints,
        action as Complaint["status"],
        `Bulk update to ${action}`,
        user?.name || "Admin",
      );
      setSelectedComplaints([]);
    }
    setBulkDialog(false);
  };

  const handleCleanupResolved = () => {
    const deletedCount = deleteResolvedComplaints();
    setShowCleanupDialog(false);
    alert(`${deletedCount} resolved complaints have been removed.`);
  };

  const exportData = () => {
    const data = JSON.stringify(filteredComplaints, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `complaints-export-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
  };

  // Scheme Management Handlers
  const handleAddScheme = () => {
    setSchemeForm({
      name: "",
      description: "",
      category: "",
      eligibility: "",
      requiredDocuments: "",
      benefits: "",
      applicationProcess: "",
      applyLink: "",
      department: "",
      validUntil: "",
    });
    setSelectedScheme(null);
    setShowSchemeDialog(true);
  };

  const handleEditScheme = (scheme: any) => {
    setSchemeForm({
      name: scheme.name,
      description: scheme.description,
      category: scheme.category,
      eligibility: scheme.eligibility.join("\n"),
      requiredDocuments: scheme.requiredDocuments.join("\n"),
      benefits: scheme.benefits,
      applicationProcess: scheme.applicationProcess,
      applyLink: scheme.applyLink,
      department: scheme.department,
      validUntil: scheme.validUntil || "",
    });
    setSelectedScheme(scheme);
    setShowSchemeDialog(true);
  };

  const handleDeleteScheme = (scheme: any) => {
    setSelectedScheme(scheme);
    setShowDeleteSchemeDialog(true);
  };

  const confirmDeleteScheme = () => {
    if (selectedScheme) {
      deleteScheme(selectedScheme.id);
      setShowDeleteSchemeDialog(false);
      setSelectedScheme(null);
    }
  };

  const handleSchemeSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const schemeData = {
      name: schemeForm.name,
      description: schemeForm.description,
      category: schemeForm.category,
      eligibility: schemeForm.eligibility
        .split("\n")
        .filter((item) => item.trim()),
      requiredDocuments: schemeForm.requiredDocuments
        .split("\n")
        .filter((item) => item.trim()),
      benefits: schemeForm.benefits,
      applicationProcess: schemeForm.applicationProcess,
      applyLink: schemeForm.applyLink,
      department: schemeForm.department,
      validUntil: schemeForm.validUntil,
      isActive: true,
    };

    if (selectedScheme) {
      // Edit existing scheme
      updateScheme(selectedScheme.id, schemeData);
    } else {
      // Add new scheme
      addScheme(schemeData);
    }

    setShowSchemeDialog(false);
  };

  const categories = [
    "Agriculture",
    "Health",
    "Social Welfare",
    "Education",
    "Employment",
    "Housing",
    "Women & Child Development",
    "Senior Citizens",
    "Disabled Welfare",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <span className="text-lg sm:text-xl font-bold text-gray-900 block">
                  TG Civic
                </span>
                <span className="text-xs text-gray-600 hidden sm:block">
                  {isAdmin ? "Admin Dashboard" : "Official Dashboard"}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              {isAdmin && (
                <Badge
                  variant="secondary"
                  className="bg-red-100 text-red-800 hidden sm:flex"
                >
                  <Shield className="w-3 h-3 mr-1" />
                  Administrator
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/")}
                className="text-xs sm:text-sm px-2 sm:px-4"
              >
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Home</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              {isAdmin ? "Admin Dashboard" : "Official Dashboard"}
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              {isAdmin
                ? "Full administrative control over civic complaints"
                : "Manage and resolve assigned complaints"}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
          {statsData.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-3 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 truncate">
                      {stat.title}
                    </p>
                    <p className="text-xl sm:text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p
                      className={`text-xs sm:text-sm flex items-center gap-1 mt-1 ${
                        stat.change.startsWith("+")
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      <TrendingUp className="w-3 h-3" />
                      <span className="hidden sm:inline">{stat.change}</span>
                    </p>
                  </div>
                  <div className={`${stat.color} opacity-80 ml-2`}>
                    <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center">
                      {React.cloneElement(stat.icon, {
                        className: "w-4 h-4 sm:w-6 sm:h-6",
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Admin Controls */}
        {isAdmin && (
          <Card className="mb-6 bg-red-50 border-red-200">
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-red-900 text-base sm:text-lg">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                Platform Controls
              </CardTitle>
              <CardDescription className="text-red-700 text-sm">
                Administrative actions with system-wide impact
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCleanupDialog(true)}
                  className="border-red-300 text-red-700 hover:bg-red-100 justify-start h-10 text-xs sm:text-sm"
                >
                  <Archive className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Remove All Resolved</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportData}
                  className="border-blue-300 text-blue-700 hover:bg-blue-100 justify-start h-10 text-xs sm:text-sm"
                >
                  <Download className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Export Data</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="border-gray-300 text-gray-700 hover:bg-gray-100 justify-start h-10 text-xs sm:text-sm"
                >
                  <RefreshCw className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">Refresh Data</span>
                </Button>
                {selectedComplaints.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setBulkDialog(true)}
                    className="border-purple-300 text-purple-700 hover:bg-purple-100 justify-start h-10 text-xs sm:text-sm sm:col-span-2 lg:col-span-1"
                  >
                    <Settings className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">
                      Bulk Actions ({selectedComplaints.length})
                    </span>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader className="pb-3 sm:pb-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {/* Search - Full width on mobile */}
              <div>
                <Label className="text-sm font-medium">Search</Label>
                <div className="relative mt-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="ID, Title, Name, Phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-10 text-sm"
                  />
                </div>
              </div>

              {/* Filters Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="h-10 text-sm mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="assigned">Assigned</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Priority</Label>
                  <Select
                    value={filterPriority}
                    onValueChange={setFilterPriority}
                  >
                    <SelectTrigger className="h-10 text-sm mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Category</Label>
                  <Select
                    value={filterCategory}
                    onValueChange={setFilterCategory}
                  >
                    <SelectTrigger className="h-10 text-sm mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="roads">Roads</SelectItem>
                      <SelectItem value="water">Water</SelectItem>
                      <SelectItem value="sanitation">Sanitation</SelectItem>
                      <SelectItem value="electricity">Electricity</SelectItem>
                      <SelectItem value="streetlights">
                        Street Lights
                      </SelectItem>
                      <SelectItem value="safety">Safety</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilterStatus("all");
                      setFilterPriority("all");
                      setFilterCategory("all");
                      setSearchTerm("");
                    }}
                    className="w-full h-10 text-sm"
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Complaints List */}
        <Card>
          <CardHeader className="pb-3 sm:pb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                  Complaints ({filteredComplaints.length})
                </CardTitle>
                <CardDescription className="text-sm">
                  Manage and resolve citizen complaints
                </CardDescription>
              </div>
              {isAdmin && filteredComplaints.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={
                      selectedComplaints.length === filteredComplaints.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                  <Label className="text-sm">Select All</Label>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3 sm:space-y-4">
              {filteredComplaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                >
                  {/* Mobile Layout */}
                  <div className="block sm:hidden">
                    <div className="p-3">
                      {/* Header Row */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          {isAdmin && (
                            <Checkbox
                              checked={selectedComplaints.includes(
                                complaint.id,
                              )}
                              onCheckedChange={(checked) =>
                                handleComplaintSelect(
                                  complaint.id,
                                  checked as boolean,
                                )
                              }
                            />
                          )}
                          <span className="font-mono text-xs text-blue-600 font-medium truncate">
                            {complaint.id}
                          </span>
                        </div>
                        <div className="flex gap-1 ml-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewComplaintDetails(complaint)}
                            className="h-8 px-2"
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 h-8 px-2"
                            onClick={() => takeAction(complaint)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          {isAdmin && (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteComplaintHandler(complaint)}
                              className="h-8 px-2"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Status and Priority */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        <Badge
                          variant="outline"
                          className={`${getPriorityColor(complaint.priority)} text-xs`}
                        >
                          {complaint.priority.toUpperCase()}
                        </Badge>
                        <Badge
                          className={`${getStatusColor(complaint.status)} text-xs`}
                        >
                          {getStatusIcon(complaint.status)}
                          <span className="ml-1">
                            {getStatusDisplayName(complaint.status)}
                          </span>
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {complaint.subcategory}
                        </Badge>
                      </div>

                      {/* Title */}
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm leading-tight">
                        {complaint.title}
                      </h3>

                      {/* Details */}
                      <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">
                            {complaint.landmark ||
                              complaint.location.split(",")[0]}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{complaint.name}</span>
                          <span className="text-gray-400">•</span>
                          <Phone className="w-3 h-3 flex-shrink-0" />
                          <span>{complaint.phone}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 flex-shrink-0" />
                          <span>{formatDate(complaint.createdAt)}</span>
                        </div>
                        {complaint.assignedTo && (
                          <div className="flex items-center gap-1">
                            <Building2 className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">
                              {complaint.assignedTo}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:flex items-center justify-between p-4">
                    <div className="flex items-center space-x-4 flex-1">
                      {isAdmin && (
                        <Checkbox
                          checked={selectedComplaints.includes(complaint.id)}
                          onCheckedChange={(checked) =>
                            handleComplaintSelect(
                              complaint.id,
                              checked as boolean,
                            )
                          }
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-mono text-sm text-blue-600 font-medium">
                            {complaint.id}
                          </span>
                          <Badge
                            variant="outline"
                            className={getPriorityColor(complaint.priority)}
                          >
                            {complaint.priority.toUpperCase()}
                          </Badge>
                          <Badge className={getStatusColor(complaint.status)}>
                            {getStatusIcon(complaint.status)}
                            <span className="ml-1">
                              {getStatusDisplayName(complaint.status)}
                            </span>
                          </Badge>
                        </div>

                        <h3 className="font-semibold text-gray-900 mb-1">
                          {complaint.title}
                        </h3>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {complaint.landmark ||
                              complaint.location.split(",")[0]}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {complaint.name}
                          </div>
                          <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            {complaint.phone}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatDate(complaint.createdAt)}
                          </div>
                          <Badge variant="secondary">
                            {complaint.subcategory}
                          </Badge>
                          {complaint.assignedTo && (
                            <div className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              {complaint.assignedTo}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewComplaintDetails(complaint)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => takeAction(complaint)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Action
                      </Button>
                      {isAdmin && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteComplaintHandler(complaint)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {filteredComplaints.length === 0 && (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No complaints found
                  </h3>
                  <p className="text-gray-600">
                    No complaints match the current filters.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Complaint Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedComplaint && (
            <>
              <DialogHeader>
                <DialogTitle>
                  Complaint Details - {selectedComplaint.id}
                </DialogTitle>
                <DialogDescription>
                  Complete information and history for this complaint
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Status</Label>
                    <Badge className={getStatusColor(selectedComplaint.status)}>
                      {getStatusDisplayName(selectedComplaint.status)}
                    </Badge>
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <Badge
                      className={getPriorityColor(selectedComplaint.priority)}
                    >
                      {selectedComplaint.priority.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label>Title</Label>
                  <p className="font-medium">{selectedComplaint.title}</p>
                </div>
                <div>
                  <Label>Description</Label>
                  <p className="text-gray-700">
                    {selectedComplaint.description}
                  </p>
                </div>
                <div>
                  <Label>Contact</Label>
                  <p>
                    {selectedComplaint.name} - {selectedComplaint.phone}
                  </p>
                </div>
                <div>
                  <Label>Location</Label>
                  <p>{selectedComplaint.location}</p>
                  {selectedComplaint.landmark && (
                    <p>Near: {selectedComplaint.landmark}</p>
                  )}
                </div>
                {selectedComplaint.assignedTo && (
                  <div>
                    <Label>Assigned To</Label>
                    <p>{selectedComplaint.assignedTo}</p>
                  </div>
                )}
                <div>
                  <Label>History</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedComplaint.history.map((entry, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">
                            {getStatusDisplayName(entry.status)}
                          </span>
                          <span className="text-sm text-gray-600">
                            {formatDate(entry.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{entry.notes}</p>
                        <p className="text-xs text-gray-600">
                          By: {entry.updatedBy}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Action Dialog */}
      <Dialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Take Action</DialogTitle>
            <DialogDescription>
              Update complaint status and add notes
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleActionSubmit} className="space-y-4">
            <div>
              <Label>Status</Label>
              <Select
                value={actionForm.status}
                onValueChange={(value) =>
                  setActionForm({ ...actionForm, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Assign To</Label>
              <Input
                value={actionForm.assignedTo}
                onChange={(e) =>
                  setActionForm({ ...actionForm, assignedTo: e.target.value })
                }
                placeholder="Department or team name"
              />
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea
                value={actionForm.notes}
                onChange={(e) =>
                  setActionForm({ ...actionForm, notes: e.target.value })
                }
                placeholder="Add update notes..."
                required
              />
            </div>
            <div className="flex space-x-3">
              <Button type="submit" className="flex-1">
                Update
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowActionDialog(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Complaint</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete complaint{" "}
              <strong>{selectedComplaint?.id}</strong>? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Actions Dialog */}
      <Dialog open={showBulkDialog} onOpenChange={setBulkDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bulk Actions</DialogTitle>
            <DialogDescription>
              Apply actions to {selectedComplaints.length} selected complaints
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Button
              onClick={() => handleBulkAction("assigned")}
              className="w-full"
            >
              Mark as Assigned
            </Button>
            <Button
              onClick={() => handleBulkAction("in-progress")}
              className="w-full"
            >
              Mark as In Progress
            </Button>
            <Button
              onClick={() => handleBulkAction("resolved")}
              className="w-full"
            >
              Mark as Resolved
            </Button>
            <Button
              onClick={() => handleBulkAction("delete")}
              variant="destructive"
              className="w-full"
            >
              Delete Selected
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cleanup Dialog */}
      <AlertDialog open={showCleanupDialog} onOpenChange={setShowCleanupDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove All Resolved Complaints</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all complaints with "Resolved"
              status. This action cannot be undone. Are you sure you want to
              proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCleanupResolved}
              className="bg-red-600 hover:bg-red-700"
            >
              Remove All Resolved
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
