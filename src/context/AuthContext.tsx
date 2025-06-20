import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  clientStorageService,
  AuthUser,
  UserType,
  RegisterData,
  LoginData,
} from "@/services/clientStorage";

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

  // Convert AuthUser to User format
  const convertAuthUser = (authUser: AuthUser): User => ({
    id: authUser.id,
    name: authUser.name,
    email: authUser.email,
    phone: authUser.phone,
    userType: authUser.userType,
    role: authUser.role,
    department: authUser.department,
    isActive: authUser.isActive,
    createdAt: authUser.createdAt,
    lastLogin: authUser.lastLogin,
  });

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

  const login = async (
    email: string,
    password: string,
    userType: UserType,
  ): Promise<boolean> => {
    setIsLoading(true);

    try {
      const loginData: LoginData = { email, password, userType };
      const authUser = await clientStorageService.login(loginData);

      if (authUser) {
        const user = convertAuthUser(authUser);
        setUser(user);
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
    userType: UserType;
    department?: string;
    employeeId?: string;
    role?: "super_admin" | "admin" | "moderator";
  }): Promise<boolean> => {
    setIsLoading(true);

    try {
      const registerData: RegisterData = {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password: userData.password,
        userType: userData.userType,
        department: userData.department,
        employeeId: userData.employeeId,
        role: userData.role,
      };

      const authUser = await clientStorageService.register(registerData);

      if (authUser) {
        const user = convertAuthUser(authUser);
        setUser(user);
        return true;
      }

      return false;
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
