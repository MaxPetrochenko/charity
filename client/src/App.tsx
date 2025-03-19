import "./App.css";
import Header from "./Components/Header";
import MainPage from "./Components/MainPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./Components/Login";
import RegisterPage from "./Components/Register";
import CreateFundraisingPage from "./Components/CreateFundraising";
import Dashboard from "./Components/Dashboard";
import { AuthProvider } from "./Context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import DefaultProtectedRouteJSX from "./Components/DefaultRoute";

const App: React.FC = () => {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <a href="/">CLICK HERE</a>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/createfund"
              element={
                <DefaultProtectedRouteJSX>
                  <CreateFundraisingPage />
                </DefaultProtectedRouteJSX>
              }
            />
            <Route
              path="/"
              element={
                <DefaultProtectedRouteJSX>
                  <MainPage />
                </DefaultProtectedRouteJSX>
              }
            />

            <Route
              path="/home"
              element={
                <DefaultProtectedRouteJSX>
                  <MainPage />
                </DefaultProtectedRouteJSX>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
};

export default App;
