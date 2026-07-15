import { useEffect, useState } from "react";
import api from "../api/axios.js";

export default function Items() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => api.get("/books").then((res) => setBooks(res.data)).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Remove this book listing?")) return;
    await api.delete(`/books/${id}`);
    load();
  };

  return (
    <main className="page container">
      <div className="dash-header"><h2 style={{ margin: 0 }}>All book listings</h2></div>
      {loading ? (
        <p>Loading…</p>
      ) : books.length === 0 ? (
        <div className="empty-state">No books have been listed yet.</div>
      ) : (
        <table className="data-table">
          <thead><tr><th>Title</th><th>Seller</th><th>Price</th><th>Stock</th><th></th></tr></thead>
          <tbody>
            {books.map((b) => (
              <tr key={b._id}>
                <td>{b.title}</td>
                <td>{b.seller?.businessName}</td>
                <td>${b.price.toFixed(2)}</td>
                <td>{b.quantity}</td>
                <td><button className="btn btn-danger btn-sm" onClick={() => handleDelete(b._id)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
