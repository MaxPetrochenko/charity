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
enum UserRole {
  none = "none",
  user = "user",
  manager = "manager",
  admin = "admin",
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<UserRole>(UserRole.none);

  const checkAuth = async () => {
    try {
      await axios.get("http://localhost:5000/api/protected", {
        withCredentials: true,
      });
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    }
  };
  const getKeyByValue = (value: string) => {
    const index = Object.values(UserRole).indexOf(value as unknown as UserRole);
    return Object.values(UserRole)[index];
  };
  const login = async (user: IUser) => {
    await checkAuth(); // Update state after login
    setRole(getKeyByValue(user.role));
  };

  const logout = async () => {
    await axios.post(
      "http://localhost:5000/logout",
      {},
      { withCredentials: true }
    );
    setIsAuthenticated(false);
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

export const useAuth = () => useContext(AuthContext)!;
