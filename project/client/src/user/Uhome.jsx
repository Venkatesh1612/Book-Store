import { useEffect, useState } from "react";
import api from "../api/axios.js";
import Uitem from "./Uitem.jsx";

export default function Uhome() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/books").then((res) => setBooks(res.data)).finally(() => setLoading(false));
  }, []);

  const featured = books.slice(0, 8);
  const genres = [...new Set(books.flatMap((b) => b.genres || []))].slice(0, 6);

  return (
    <main className="page container">
      <div className="dash-header">
        <div>
          <p className="section-label">Recommended for you</p>
          <h2 style={{ margin: 0 }}>Fresh off the shelf</h2>
        </div>
      </div>

      {genres.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          {genres.map((g) => <span className="genre-tag" key={g}>{g}</span>)}
        </div>
      )}

      {loading ? (
        <p>Loading books…</p>
      ) : featured.length === 0 ? (
        <div className="empty-state">No books are listed yet — check back soon.</div>
      ) : (
        <div className="book-grid">
          {featured.map((b) => <Uitem key={b._id} book={b} />)}
        </div>
      )}
    </main>
  );
}
