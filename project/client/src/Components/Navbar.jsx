import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

// Generic top navbar for the public site and logged-in readers.
export default function Navbar() {
  const { token, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link to="/" className="brand">
          Bindery <span className="brand-mark">&amp; Co.</span>
        </Link>
        <ul className="nav-links">
          <li><Link to="/books">Browse</Link></li>
          {token && role === "user" ? (
            <>
              <li><Link to="/my-orders">My orders</Link></li>
              <li><Link to="/profile">Profile</Link></li>
              <li><button onClick={handleLogout}>Log out</button></li>
            </>
          ) : (
            <>
              <li><Link to="/login">Log in</Link></li>
              <li><Link to="/signup">Sign up</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
