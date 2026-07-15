import { useEffect, useState } from "react";
import api from "../api/axios.js";

export default function Seller() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => api.get("/sellers").then((res) => setSellers(res.data)).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleApprove = async (id) => { await api.put(`/sellers/${id}/approve`); load(); };
  const handleDelete = async (id) => {
    if (!confirm("Remove this seller account?")) return;
    await api.delete(`/sellers/${id}`);
    load();
  };

  return (
    <main className="page container">
      <div className="dash-header"><h2 style={{ margin: 0 }}>Sellers</h2></div>
      {loading ? (
        <p>Loading…</p>
      ) : sellers.length === 0 ? (
        <div className="empty-state">No sellers have signed up yet.</div>
      ) : (
        <table className="data-table">
          <thead><tr><th>Business</th><th>Email</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {sellers.map((s) => (
              <tr key={s._id}>
                <td>{s.businessName}</td>
                <td>{s.email}</td>
                <td>
                  <span className={`status-pill ${s.approved ? "status-delivered" : "status-pending"}`}>
                    {s.approved ? "approved" : "pending"}
                  </span>
                </td>
                <td style={{ display: "flex", gap: 8 }}>
                  {!s.approved && <button className="btn btn-primary btn-sm" onClick={() => handleApprove(s._id)}>Approve</button>}
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(s._id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
