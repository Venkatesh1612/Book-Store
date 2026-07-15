import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Shome() {
  const [books, setBooks] = useState([]);
  const [orders, setOrders] = useState([]);
  const { profile } = useAuth();

  useEffect(() => {
    api.get("/books/seller/mine").then((res) => setBooks(res.data));
    api.get("/sellers/orders").then((res) => setOrders(res.data));
  }, []);

  const totalStock = books.reduce((sum, b) => sum + b.quantity, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  return (
    <main className="page container">
      <div className="dash-header">
        <div>
          <p className="section-label">Seller dashboard</p>
          <h2 style={{ margin: 0 }}>Welcome back, {profile?.businessName}</h2>
        </div>
        <Link className="btn btn-accent" to="/seller/add-book">+ Add a book</Link>
      </div>

      <div className="stat-row">
        <div className="stat-card"><div className="num">{books.length}</div><div className="label">Listed titles</div></div>
        <div className="stat-card"><div className="num">{totalStock}</div><div className="label">Copies in stock</div></div>
        <div className="stat-card"><div className="num">{orders.length}</div><div className="label">Total orders</div></div>
        <div className="stat-card"><div className="num">{pendingOrders}</div><div className="label">Pending orders</div></div>
      </div>

      <p className="section-label">Recent listings</p>
      {books.length === 0 ? (
        <div className="empty-state">You haven't listed any books yet.</div>
      ) : (
        <table className="data-table">
          <thead><tr><th>Title</th><th>Price</th><th>Stock</th></tr></thead>
          <tbody>
            {books.slice(0, 5).map((b) => (
              <tr key={b._id}><td>{b.title}</td><td>${b.price.toFixed(2)}</td><td>{b.quantity}</td></tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
