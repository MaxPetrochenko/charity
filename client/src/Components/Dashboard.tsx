import { Link } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Header from "./Header";
import { useAuth } from "../Context/AuthContext";
const Dashboard = () => {
  const { logout } = useAuth();
  return (
    <nav>
      <ul>
        <li>
          <Link to="/home">Home</Link>
        </li>
        <li>
          <Link to="/createfund">Create Fundraising</Link>
        </li>
        <li>
          <button onClick={logout}>Log out</button>
        </li>
      </ul>
    </nav>
  );
};
export default Dashboard;
