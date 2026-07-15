import { useEffect, useState } from "react";
import api from "../api/axios.js";
import OrderItem from "./OrderItem.jsx";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/orders/mine").then((res) => setOrders(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <main className="page container">
      <div className="dash-header">
        <h2 style={{ margin: 0 }}>My orders</h2>
      </div>
      {loading ? (
        <p>Loading…</p>
      ) : orders.length === 0 ? (
        <div className="empty-state">You haven't placed any orders yet.</div>
      ) : (
        orders.map((o) => <OrderItem key={o._id} order={o} />)
      )}
    </main>
  );
}
