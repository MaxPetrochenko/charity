import { Link } from "react-router-dom";

const Header = () => (
  <header>
    <nav>
      <ul>
        <li>
          <Link to="/login">Login</Link>
        </li>
      </ul>
    </nav>
  </header>
);
export default Header;
