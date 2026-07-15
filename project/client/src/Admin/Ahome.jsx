import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Ahome() {
  const [stats, setStats] = useState({ users: 0, sellers: 0, books: 0, orders: 0 });
  const { profile } = useAuth();

  useEffect(() => {
    Promise.all([
      api.get("/users"),
      api.get("/sellers"),
      api.get("/books"),
      api.get("/orders"),
    ]).then(([users, sellers, books, orders]) => {
      setStats({
        users: users.data.length,
        sellers: sellers.data.length,
        books: books.data.length,
        orders: orders.data.length,
      });
    });
  }, []);

  return (
    <main className="page container">
      <div className="dash-header">
        <div>
          <p className="section-label">Admin dashboard</p>
          <h2 style={{ margin: 0 }}>Welcome, {profile?.name}</h2>
        </div>
      </div>
      <div className="stat-row">
        <div className="stat-card"><div className="num">{stats.users}</div><div className="label">Readers</div></div>
        <div className="stat-card"><div className="num">{stats.sellers}</div><div className="label">Sellers</div></div>
        <div className="stat-card"><div className="num">{stats.books}</div><div className="label">Book listings</div></div>
        <div className="stat-card"><div className="num">{stats.orders}</div><div className="label">Orders placed</div></div>
      </div>
      <p style={{ fontFamily: "var(--font-ui)", color: "var(--ink-soft)" }}>
        Use the navigation above to manage books, approve or remove sellers, and oversee reader accounts.
      </p>
    </main>
  );
}
