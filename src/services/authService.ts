import connectToDatabase from "@/lib/database";
import Citizen, { ICitizen } from "@/models/Citizen";
import Admin, { IAdmin } from "@/models/Admin";

export type UserType = "citizen" | "admin";

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  userType: UserType;
  // Admin specific fields
  department?: string;
  employeeId?: string;
  role?: "super_admin" | "admin" | "moderator";
}

export interface LoginData {
  email: string;
  password: string;
  userType: UserType;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: UserType;
  role?: string;
  department?: string;
  isActive?: boolean;
  lastLogin?: string;
  createdAt: string;
}

class AuthService {
  async register(userData: RegisterData): Promise<AuthUser | null> {
    try {
      await connectToDatabase();

      if (userData.userType === "citizen") {
        // Check if citizen already exists
        const existingCitizen = await Citizen.findOne({
          $or: [{ email: userData.email }, { phone: userData.phone }],
        });

        if (existingCitizen) {
          throw new Error("User with this email or phone already exists");
        }

        // Create new citizen
        const citizen = new Citizen({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          password: userData.password,
          userType: "citizen",
        });

        await citizen.save();

        return {
          id: citizen._id.toString(),
          name: citizen.name,
          email: citizen.email,
          phone: citizen.phone,
          userType: citizen.userType,
          createdAt: citizen.createdAt.toISOString(),
        };
      } else if (userData.userType === "admin") {
        // Check if admin already exists
        const existingAdmin = await Admin.findOne({
          $or: [
            { email: userData.email },
            { phone: userData.phone },
            { employeeId: userData.employeeId },
          ],
        });

        if (existingAdmin) {
          throw new Error(
            "Admin with this email, phone, or employee ID already exists",
          );
        }

        // Create new admin
        const admin = new Admin({
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          password: userData.password,
          userType: "admin",
          department: userData.department,
          employeeId: userData.employeeId,
          role: userData.role || "admin",
        });

        await admin.save();

        return {
          id: admin._id.toString(),
          name: admin.name,
          email: admin.email,
          phone: admin.phone,
          userType: admin.userType,
          role: admin.role,
          department: admin.department,
          isActive: admin.isActive,
          createdAt: admin.createdAt.toISOString(),
        };
      }

      throw new Error("Invalid user type");
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  async login(loginData: LoginData): Promise<AuthUser | null> {
    try {
      await connectToDatabase();

      if (loginData.userType === "citizen") {
        const citizen = await Citizen.findOne({
          email: loginData.email,
        }).select("+password");

        if (!citizen) {
          throw new Error("Invalid credentials");
        }

        const isPasswordValid = await citizen.comparePassword(
          loginData.password,
        );

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        // Update last login
        citizen.lastLogin = new Date();
        await citizen.save();

        return {
          id: citizen._id.toString(),
          name: citizen.name,
          email: citizen.email,
          phone: citizen.phone,
          userType: citizen.userType,
          lastLogin: citizen.lastLogin.toISOString(),
          createdAt: citizen.createdAt.toISOString(),
        };
      } else if (loginData.userType === "admin") {
        const admin = await Admin.findOne({
          email: loginData.email,
          isActive: true,
        }).select("+password");

        if (!admin) {
          throw new Error("Invalid credentials or account inactive");
        }

        const isPasswordValid = await admin.comparePassword(loginData.password);

        if (!isPasswordValid) {
          throw new Error("Invalid credentials");
        }

        // Update last login and add to login history
        admin.lastLogin = new Date();
        admin.loginHistory.push({
          timestamp: new Date(),
          ipAddress: "192.168.1.1", // In real app, get from request
          userAgent: "Browser", // In real app, get from request
        });
        await admin.save();

        return {
          id: admin._id.toString(),
          name: admin.name,
          email: admin.email,
          phone: admin.phone,
          userType: admin.userType,
          role: admin.role,
          department: admin.department,
          isActive: admin.isActive,
          lastLogin: admin.lastLogin.toISOString(),
          createdAt: admin.createdAt.toISOString(),
        };
      }

      throw new Error("Invalid user type");
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  async getUserById(id: string, userType: UserType): Promise<AuthUser | null> {
    try {
      await connectToDatabase();

      if (userType === "citizen") {
        const citizen = await Citizen.findById(id);
        if (!citizen) return null;

        return {
          id: citizen._id.toString(),
          name: citizen.name,
          email: citizen.email,
          phone: citizen.phone,
          userType: citizen.userType,
          lastLogin: citizen.lastLogin?.toISOString(),
          createdAt: citizen.createdAt.toISOString(),
        };
      } else if (userType === "admin") {
        const admin = await Admin.findById(id);
        if (!admin) return null;

        return {
          id: admin._id.toString(),
          name: admin.name,
          email: admin.email,
          phone: admin.phone,
          userType: admin.userType,
          role: admin.role,
          department: admin.department,
          isActive: admin.isActive,
          lastLogin: admin.lastLogin?.toISOString(),
          createdAt: admin.createdAt.toISOString(),
        };
      }

      return null;
    } catch (error) {
      console.error("Get user error:", error);
      return null;
    }
  }
}

export const authService = new AuthService();
