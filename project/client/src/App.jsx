import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./Components/Navbar.jsx";
import Footer from "./Components/Footer.jsx";
import Home from "./Components/Home.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

// User
import Signup from "./User/Signup.jsx";
import Login from "./User/Login.jsx";
import Uhome from "./User/Uhome.jsx";
import Products from "./User/Products.jsx";
import BookDetail from "./User/BookDetail.jsx";
import Cart from "./User/Cart.jsx";
import MyOrders from "./User/MyOrders.jsx";
import OrderConfirmation from "./User/OrderConfirmation.jsx";
import Profile from "./User/Profile.jsx";

// Seller
import Snavbar from "./Seller/Snavbar.jsx";
import Ssignup from "./Seller/Ssignup.jsx";
import Slogin from "./Seller/Slogin.jsx";
import Shome from "./Seller/Shome.jsx";
import Addbook from "./Seller/Addbook.jsx";
import MyProducts from "./Seller/MyProducts.jsx";
import Orders from "./Seller/Orders.jsx";

// Admin
import Anavbar from "./Admin/Anavbar.jsx";
import Asignup from "./Admin/Asignup.jsx";
import Alogin from "./Admin/Alogin.jsx";
import Ahome from "./Admin/Ahome.jsx";
import Users from "./Admin/Users.jsx";
import SellerAdmin from "./Admin/Seller.jsx";
import Items from "./Admin/items.jsx";

function Chrome({ children }) {
  const { pathname } = useLocation();
  let NavComponent = Navbar;
  if (pathname.startsWith("/seller")) NavComponent = Snavbar;
  else if (pathname.startsWith("/admin")) NavComponent = Anavbar;

  return (
    <div className="app-shell">
      <NavComponent />
      {children}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Chrome>
      <Routes>
        {/* Public / reader-facing */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/books" element={<Products />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/discover" element={<Uhome />} />

        <Route path="/cart" element={<ProtectedRoute role="user"><Cart /></ProtectedRoute>} />
        <Route path="/my-orders" element={<ProtectedRoute role="user"><MyOrders /></ProtectedRoute>} />
        <Route path="/order-confirmation/:id" element={<ProtectedRoute role="user"><OrderConfirmation /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute role="user"><Profile /></ProtectedRoute>} />

        {/* Seller */}
        <Route path="/seller/signup" element={<Ssignup />} />
        <Route path="/seller/login" element={<Slogin />} />
        <Route path="/seller/home" element={<ProtectedRoute role="seller" redirectTo="/seller/login"><Shome /></ProtectedRoute>} />
        <Route path="/seller/add-book" element={<ProtectedRoute role="seller" redirectTo="/seller/login"><Addbook /></ProtectedRoute>} />
        <Route path="/seller/products" element={<ProtectedRoute role="seller" redirectTo="/seller/login"><MyProducts /></ProtectedRoute>} />
        <Route path="/seller/orders" element={<ProtectedRoute role="seller" redirectTo="/seller/login"><Orders /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin/signup" element={<Asignup />} />
        <Route path="/admin/login" element={<Alogin />} />
        <Route path="/admin/home" element={<ProtectedRoute role="admin" redirectTo="/admin/login"><Ahome /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute role="admin" redirectTo="/admin/login"><Users /></ProtectedRoute>} />
        <Route path="/admin/sellers" element={<ProtectedRoute role="admin" redirectTo="/admin/login"><SellerAdmin /></ProtectedRoute>} />
        <Route path="/admin/books" element={<ProtectedRoute role="admin" redirectTo="/admin/login"><Items /></ProtectedRoute>} />

        <Route path="*" element={<Home />} />
      </Routes>
    </Chrome>
  );
}
