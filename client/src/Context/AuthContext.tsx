import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface AuthContextType {
  isAuthenticated: boolean;
  role: UserRole;
  checkAuth: () => Promise<void>;
  login: (user: IUser) => Promise<void>;
  logout: () => Promise<void>;
}

interface IUser {
  _id: any;
  email: string;
  password: string;
  role: string;
  _v: number;
}

export enum UserRole {
  none = "none",
  user = "user",
  manager = "manager",
  admin = "admin",
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<UserRole>(UserRole.none); // Default to "none"

  const checkAuth = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/protected`,
        {
          withCredentials: true,
        }
      );
      setIsAuthenticated(true);
      setRole(getKeyByValue(res.data.role));
    } catch {
      setIsAuthenticated(false);
      setRole(UserRole.none);
    }
  };

  const getKeyByValue = (value: string): UserRole => {
    return Object.values(UserRole).includes(value as UserRole)
      ? (value as UserRole)
      : UserRole.none;
  };

  const login = async (user: IUser) => {
    await checkAuth(); // Update state after login
    setRole(getKeyByValue(user.role));
  };

  const logout = async () => {
    await axios.post(
      `${process.env.REACT_APP_API_URL}/logout`,
      {},
      { withCredentials: true }
    );
    setIsAuthenticated(false);
    setRole(UserRole.none);
  };

  useEffect(() => {
    checkAuth(); // Check authentication on mount
  }, []);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, role, checkAuth, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
