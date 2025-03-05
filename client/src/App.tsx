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

const App: React.FC = () => {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <a href="/">CLICK HERE</a>
          <Routes>
            <Route path="/login" element={LoginPage()}></Route>
            <Route path="/createfund" element={CreateFundraisingPage()}></Route>
            <Route path="/home" element={MainPage()}></Route>
            <Route path="/register" element={RegisterPage()}></Route>
            <Route
              path="/"
              element={
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
                    <MainPage />
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
};

export default App;
