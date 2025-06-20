import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";

export interface Notification {
  id: string;
  type:
    | "complaint_submitted"
    | "complaint_assigned"
    | "complaint_resolved"
    | "complaint_updated"
    | "system";
  title: string;
  message: string;
  complaintId?: string;
  userId: string;
  userRole: "citizen" | "admin" | "official";
  isRead: boolean;
  createdAt: string;
  priority: "low" | "medium" | "high";
  actionUrl?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (
    notification: Omit<Notification, "id" | "createdAt" | "isRead">,
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  getNotificationsByUser: (userId: string, userRole: string) => Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
};

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem("tg-civic-notifications");
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed);
      } catch (error) {
        console.error("Error loading notifications from localStorage:", error);
      }
    } else {
      // Initialize with sample notifications
      const sampleNotifications: Notification[] = [
        {
          id: "notification-001",
          type: "complaint_submitted",
          title: "🚨 New High Priority Complaint",
          message:
            "ROADS complaint: 'Dangerous pothole causing accidents' submitted by Rajesh Kumar in Hitec City. Priority: HIGH",
          complaintId: "TGC2024001234",
          userId: "all-admins",
          userRole: "admin",
          priority: "high",
          actionUrl: "/dashboard",
          createdAt: "2024-01-16T09:30:00Z",
          isRead: false,
        },
        {
          id: "notification-004",
          type: "complaint_submitted",
          title: "📋 New Water Supply Complaint",
          message:
            "WATER complaint: 'No water for 3 days' submitted by Priya Sharma in Jubilee Hills. Priority: MEDIUM",
          complaintId: "TGC2024001235",
          userId: "all-admins",
          userRole: "admin",
          priority: "medium",
          actionUrl: "/dashboard",
          createdAt: "2024-01-16T08:15:00Z",
          isRead: false,
        },
        {
          id: "notification-005",
          type: "complaint_submitted",
          title: "🚨 Urgent Street Light Issue",
          message:
            "STREET-LIGHTS complaint: 'Dark street causing safety concerns' submitted by Mohammed Ali in Gachibowli. Priority: HIGH",
          complaintId: "TGC2024001236",
          userId: "all-admins",
          userRole: "admin",
          priority: "high",
          actionUrl: "/dashboard",
          createdAt: "2024-01-16T07:45:00Z",
          isRead: false,
        },
        {
          id: "notif-002",
          type: "complaint_resolved",
          title: "Your Complaint Resolved",
          message:
            "Your water supply issue complaint has been successfully resolved",
          complaintId: "TGC2024001235",
          userId: "citizen-001",
          userRole: "citizen",
          isRead: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          priority: "high",
          actionUrl: "/track-complaint",
        },
        {
          id: "notif-003",
          type: "system",
          title: "System Maintenance",
          message: "Scheduled maintenance will occur tonight from 2-4 AM",
          userId: "all",
          userRole: "admin",
          isRead: true,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          priority: "low",
        },
      ];
      setNotifications(sampleNotifications);
      localStorage.setItem(
        "tg-civic-notifications",
        JSON.stringify(sampleNotifications),
      );
    }
  }, []);

  // Save notifications to localStorage whenever notifications change
  useEffect(() => {
    if (notifications.length > 0) {
      localStorage.setItem(
        "tg-civic-notifications",
        JSON.stringify(notifications),
      );
    }
  }, [notifications]);

  const generateNotificationId = (): string => {
    return `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  const addNotification = (
    notificationData: Omit<Notification, "id" | "createdAt" | "isRead">,
  ) => {
    const newNotification: Notification = {
      ...notificationData,
      id: generateNotificationId(),
      createdAt: new Date().toISOString(),
      isRead: false,
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // Show browser notification if permission granted
    if (Notification.permission === "granted") {
      new Notification(newNotification.title, {
        body: newNotification.message,
        icon: "/favicon.ico",
        badge: "/favicon.ico",
      });
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    if (!user) return;
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.userId === user.id ||
        notification.userId === "all" ||
        notification.userRole === user.userType ||
        (user.userType === "admin" && notification.userId === "all-admins")
          ? { ...notification, isRead: true }
          : notification,
      ),
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  };

  const clearAllNotifications = () => {
    if (!user) return;
    setNotifications((prev) =>
      prev.filter(
        (notification) =>
          notification.userId !== user.id &&
          notification.userId !== "all" &&
          notification.userRole !== user.role,
      ),
    );
  };

  const getNotificationsByUser = (
    userId: string,
    userRole: string,
  ): Notification[] => {
    return notifications.filter(
      (notification) =>
        notification.userId === userId ||
        notification.userId === "all" ||
        notification.userRole === userRole ||
        (userRole === "admin" && notification.userId === "all-admins") ||
        (userRole === "official" && notification.userId === "all-officials") ||
        (userRole === "admin" && notification.userId === "admin-001"), // Support legacy admin notifications
    );
  };

  const userNotifications = user
    ? getNotificationsByUser(user.id, user.role)
    : [];

  const unreadCount = userNotifications.filter((n) => !n.isRead).length;

  // Request notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const value: NotificationContextType = {
    notifications: userNotifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getNotificationsByUser,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
