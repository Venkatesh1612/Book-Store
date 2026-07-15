import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Anavbar() {
  const { logout, profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/admin/login"); };

  return (
    <nav className="nav admin">
      <div className="nav-inner">
        <Link to="/admin/home" className="brand">Bindery <span className="brand-mark">Admin</span></Link>
        <ul className="nav-links">
          <li><Link to="/admin/home">Dashboard</Link></li>
          <li><Link to="/admin/books">Books</Link></li>
          <li><Link to="/admin/sellers">Sellers</Link></li>
          <li><Link to="/admin/users">Users</Link></li>
          <li><button onClick={handleLogout}>Log out ({profile?.name})</button></li>
        </ul>
      </div>
    </nav>
  );
}
