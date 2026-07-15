import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";
import Book from "./Book.jsx";

export default function MyProducts() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => api.get("/books/seller/mine").then((res) => setBooks(res.data)).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Remove this book from your listings?")) return;
    await api.delete(`/books/${id}`);
    load();
  };

  return (
    <main className="page container">
      <div className="dash-header">
        <h2 style={{ margin: 0 }}>My books</h2>
        <Link className="btn btn-accent" to="/seller/add-book">+ Add a book</Link>
      </div>
      {loading ? (
        <p>Loading…</p>
      ) : books.length === 0 ? (
        <div className="empty-state">You haven't listed any books yet.</div>
      ) : (
        <table className="data-table">
          <thead><tr><th>Title</th><th>Author(s)</th><th>Price</th><th>Stock</th><th></th></tr></thead>
          <tbody>
            {books.map((b) => <Book key={b._id} book={b} onDelete={handleDelete} />)}
          </tbody>
        </table>
      )}
    </main>
  );
}
