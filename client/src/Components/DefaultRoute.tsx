import { JSX } from "react";
import ProtectedRoute from "./ProtectedRoute";
import Header from "./Header";
import MainPage from "./MainPage";
import Dashboard from "./Dashboard";
import { useAuth } from "../Context/AuthContext";

const DefaultProtectedRouteJSX = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {isAuthenticated ? (
        <ProtectedRoute>
          <div>
            <Dashboard />
            {children}
          </div>
        </ProtectedRoute>
      ) : (
        <ProtectedRoute
          fallback={
            <div>
              <Header />
              <MainPage />
            </div>
          }
        >
          <div></div>
        </ProtectedRoute>
      )}
    </div>
  );
};

export default DefaultProtectedRouteJSX;
