import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Snavbar() {
  const { logout, profile } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate("/seller/login"); };

  return (
    <nav className="nav seller">
      <div className="nav-inner">
        <Link to="/seller/home" className="brand">Bindery <span className="brand-mark">Seller</span></Link>
        <ul className="nav-links">
          <li><Link to="/seller/home">Dashboard</Link></li>
          <li><Link to="/seller/products">My books</Link></li>
          <li><Link to="/seller/add-book">Add book</Link></li>
          <li><Link to="/seller/orders">Orders</Link></li>
          <li><button onClick={handleLogout}>Log out ({profile?.businessName})</button></li>
        </ul>
      </div>
    </nav>
  );
}
