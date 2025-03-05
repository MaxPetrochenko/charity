import { JSX } from "react";
import ProtectedRoute from "./ProtectedRoute";
import Header from "./Header";
import MainPage from "./MainPage";
import Dashboard from "./Dashboard";

{
  /* <ProtectedRoute
  fallback={
    <div>
      <Header />
      <MainPage />
    </div>
  }
>
  <div>
    <Dashboard />
    <MainPage />
  </div>
</ProtectedRoute>; */
}
const DefaultProtectedRouteJSX = ({ children }: { children: JSX.Element }) => {
  return (
    <ProtectedRoute
      fallback={
        <div>
          <Header />
          <MainPage />
        </div>
      }
    >
      <div>
        <Dashboard />
        {children}
      </div>
    </ProtectedRoute>
  );
};
export default DefaultProtectedRouteJSX;
