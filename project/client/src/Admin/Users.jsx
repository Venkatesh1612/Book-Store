import { useEffect, useState } from "react";
import api from "../api/axios.js";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => api.get("/users").then((res) => setUsers(res.data)).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Remove this user account?")) return;
    await api.delete(`/users/${id}`);
    load();
  };

  return (
    <main className="page container">
      <div className="dash-header"><h2 style={{ margin: 0 }}>Readers</h2></div>
      {loading ? (
        <p>Loading…</p>
      ) : users.length === 0 ? (
        <div className="empty-state">No reader accounts yet.</div>
      ) : (
        <table className="data-table">
          <thead><tr><th>Name</th><th>Email</th><th>Joined</th><th></th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(u._id)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
