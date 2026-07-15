import { useEffect, useState } from "react";
import api from "../api/axios.js";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => api.get("/sellers/orders").then((res) => setOrders(res.data)).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleStatusChange = async (id, status) => {
    await api.put(`/sellers/orders/${id}/status`, { status });
    load();
  };

  return (
    <main className="page container">
      <div className="dash-header">
        <h2 style={{ margin: 0 }}>Orders</h2>
      </div>
      {loading ? (
        <p>Loading…</p>
      ) : orders.length === 0 ? (
        <div className="empty-state">No orders have come in yet.</div>
      ) : (
        <table className="data-table">
          <thead><tr><th>Order</th><th>Buyer</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id}>
                <td>#{o._id.slice(-6).toUpperCase()}</td>
                <td>{o.user?.name}</td>
                <td>{o.items.map((i) => `${i.title} ×${i.quantity}`).join(", ")}</td>
                <td>${o.totalPrice.toFixed(2)}</td>
                <td>
                  <select value={o.status} onChange={(e) => handleStatusChange(o._id, e.target.value)}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
