import { Link } from "react-router-dom";

const Header = () => (
  <header>
    <nav>
      <ul>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/createfund">Create Fundraising</Link>
        </li>
      </ul>
    </nav>
  </header>
);
export default Header;
