import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  authService,
  AuthUser,
  UserType,
  RegisterData,
  LoginData,
} from "@/services/authService";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: "citizen" | "admin";
  role?: string;
  department?: string;
  isActive?: boolean;
  createdAt: string;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    userType: UserType,
  ) => Promise<boolean>;
  register: (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    userType: UserType;
    department?: string;
    employeeId?: string;
    role?: "super_admin" | "admin" | "moderator";
  }) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Mock users database
  const mockUsers = [
    {
      id: "admin-001",
      name: "Admin User",
      email: "admin@tgcivic.gov.in",
      phone: "9876543210",
      role: "admin" as const,
      department: "IT Department",
      password: "admin123",
      createdAt: "2024-01-01T00:00:00Z",
      lastLogin: new Date().toISOString(),
    },
    {
      id: "citizen-001",
      name: "Rajesh Kumar",
      email: "rajesh@email.com",
      phone: "9876543211",
      role: "citizen" as const,
      password: "citizen123",
      createdAt: "2024-01-15T00:00:00Z",
      lastLogin: new Date().toISOString(),
    },
    {
      id: "official-001",
      name: "GHMC Officer",
      email: "officer@ghmc.gov.in",
      phone: "9876543212",
      role: "official" as const,
      department: "GHMC Roads Department",
      password: "official123",
      createdAt: "2024-01-01T00:00:00Z",
      lastLogin: new Date().toISOString(),
    },
  ];

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("tg-civic-user");
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error("Error loading user from localStorage:", error);
        localStorage.removeItem("tg-civic-user");
      }
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("tg-civic-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("tg-civic-user");
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Find user in mock database
      const foundUser = mockUsers.find(
        (u) => u.email === email && u.password === password,
      );

      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        const userWithLastLogin = {
          ...userWithoutPassword,
          lastLogin: new Date().toISOString(),
        };
        setUser(userWithLastLogin);
        return true;
      }

      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if user already exists
      const existingUser = mockUsers.find(
        (u) => u.email === userData.email || u.phone === userData.phone,
      );

      if (existingUser) {
        return false; // User already exists
      }

      // Create new user
      const newUser: User = {
        id: `citizen-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: "citizen",
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      };

      // Add to mock database (in real app, this would be an API call)
      mockUsers.push({ ...newUser, password: userData.password } as any);

      setUser(newUser);
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("tg-civic-user");
    // Force redirect to homepage after logout
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
