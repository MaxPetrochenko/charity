import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { JSX } from "react";

export interface IProtectedRouteProps {
  children: JSX.Element;
  fallback?: JSX.Element;
}

const ProtectedRoute = ({ children, fallback }: IProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) return children;
  return fallback ? fallback : <Navigate to="/" />;
};

export default ProtectedRoute;
