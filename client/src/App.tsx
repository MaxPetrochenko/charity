import "./App.css";
import Header from "./Components/Header";
import MainPage from "./Components/MainPage";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./Components/Login";
import CreateFundraisingPage from "./Components/CreateFundraising";

const App: React.FC = () => {
  return (
    <div className="App">
      <Header />

      <MainPage />
      <Routes>
        <Route path="/login" element={LoginPage()}></Route>
        <Route path="/createfund" element={CreateFundraisingPage()}></Route>
      </Routes>
    </div>
  );
};

export default App;
