import { useEffect, useState } from "react";
import api from "../api/axios.js";
import Uitem from "./Uitem.jsx";

export default function Products() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (genre) params.genre = genre;
    api.get("/books", { params }).then((res) => setBooks(res.data)).finally(() => setLoading(false));
  }, [search, genre]);

  const genres = [...new Set(books.flatMap((b) => b.genres || []))];

  return (
    <main className="page container">
      <div className="dash-header">
        <div>
          <p className="section-label">The full collection</p>
          <h2 style={{ margin: 0 }}>Browse books</h2>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            placeholder="Search title or author…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: "9px 12px", border: "1px solid var(--line)", borderRadius: 3, minWidth: 220 }}
          />
          <select value={genre} onChange={(e) => setGenre(e.target.value)} style={{ padding: "9px 12px", border: "1px solid var(--line)", borderRadius: 3 }}>
            <option value="">All genres</option>
            {genres.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading books…</p>
      ) : books.length === 0 ? (
        <div className="empty-state">No books match your search.</div>
      ) : (
        <div className="book-grid">
          {books.map((b) => <Uitem key={b._id} book={b} />)}
        </div>
      )}
    </main>
  );
}
