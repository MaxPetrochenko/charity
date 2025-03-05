import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface AuthContextType {
  isAuthenticated: boolean;
  checkAuth: () => Promise<void>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const checkAuth = async () => {
    try {
      await axios.get("http://localhost:5001/api/protected", {
        withCredentials: true,
      });
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    }
  };

  const login = async () => {
    await checkAuth(); // Update state after login
  };

  const logout = async () => {
    await axios.post(
      "http://localhost:5001/logout",
      {},
      { withCredentials: true }
    );
    setIsAuthenticated(false);
  };

  useEffect(() => {
    checkAuth(); // Check authentication on mount
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, checkAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext)!;
