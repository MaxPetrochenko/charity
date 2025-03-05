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
            <Route path="/login" element={LoginPage()}></Route>
            <Route
              path="/createfund"
              element={
                <DefaultProtectedRouteJSX children={CreateFundraisingPage()} />
              }
            />
            <Route path="/register" element={RegisterPage()}></Route>
            <Route
              path="/"
              element={<DefaultProtectedRouteJSX children={MainPage()} />}
            />
            <Route
              path="/home"
              element={<DefaultProtectedRouteJSX children={MainPage()} />}
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
};

export default App;
