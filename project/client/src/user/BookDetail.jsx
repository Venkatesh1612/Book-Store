import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function BookDetail() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [format, setFormat] = useState("paperback");
  const [added, setAdded] = useState(false);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [reviewMsg, setReviewMsg] = useState("");
  const { token, role } = useAuth();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const loadBook = () => api.get(`/books/${id}`).then((res) => setBook(res.data));

  useEffect(() => { loadBook(); }, [id]);

  if (!book) return <main className="page container"><p>Loading…</p></main>;

  const handleAddToCart = () => {
    addItem(book, quantity, format);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    setReviewMsg("");
    try {
      await api.post(`/books/${id}/review`, review);
      setReviewMsg("Thanks — your review was submitted.");
      setReview({ rating: 5, comment: "" });
      loadBook();
    } catch (err) {
      setReviewMsg(err.response?.data?.message || "Could not submit your review.");
    }
  };

  return (
    <main className="page container">
      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 36 }}>
        <div className="book-cover" style={{ aspectRatio: "2/3", borderRadius: 4 }}>
          {book.image ? <img src={book.image} alt={book.title} /> : <span>{book.title}</span>}
        </div>
        <div>
          <p className="section-label">{(book.genres || []).join(" · ") || "Uncategorized"}</p>
          <h1>{book.title}</h1>
          <p style={{ fontFamily: "var(--font-ui)", color: "var(--ink-soft)" }}>
            by {(book.authors || []).join(", ") || "Unknown author"} · sold by {book.seller?.businessName || "a Bindery seller"}
          </p>
          <p>{book.description}</p>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "1.6rem", color: "var(--burgundy)" }}>
            ${Number(book.price).toFixed(2)}
          </p>
          <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.85rem", color: "var(--ink-soft)" }}>
            {book.quantity > 0 ? `${book.quantity} in stock` : "Out of stock"}
            {book.averageRating > 0 && ` · ${book.averageRating}★ average rating`}
          </p>

          {token && role === "user" ? (
            <div className="card" style={{ maxWidth: 380, marginTop: 12 }}>
              <div className="field">
                <label>Format</label>
                <select value={format} onChange={(e) => setFormat(e.target.value)}>
                  <option value="paperback">Paperback</option>
                  <option value="ebook">E-book</option>
                  <option value="special-edition">Special edition</option>
                </select>
              </div>
              <div className="field">
                <label>Quantity</label>
                <input type="number" min={1} max={book.quantity || 1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
              </div>
              {added && <div className="success-banner">Added to your cart.</div>}
              <button className="btn btn-accent" style={{ width: "100%" }} disabled={book.quantity < 1} onClick={handleAddToCart}>
                Add to cart
              </button>
              <button className="btn btn-outline" style={{ width: "100%", marginTop: 8 }} onClick={() => navigate("/cart")}>
                Go to cart
              </button>
            </div>
          ) : (
            <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.88rem" }}>
              <a href="/login">Log in</a> as a reader to add this book to your cart.
            </p>
          )}
        </div>
      </div>

      <section style={{ marginTop: 48, maxWidth: 600 }}>
        <p className="section-label">Reviews</p>
        <h3>What readers are saying</h3>
        {(book.ratings || []).length === 0 && <p style={{ color: "var(--ink-soft)", fontFamily: "var(--font-ui)" }}>No reviews yet.</p>}
        {(book.ratings || []).map((r, i) => (
          <div key={i} className="card" style={{ marginBottom: 10 }}>
            <strong>{r.rating}★</strong>
            {r.comment && <p style={{ margin: "4px 0 0" }}>{r.comment}</p>}
          </div>
        ))}

        {token && role === "user" && (
          <form onSubmit={handleReview} style={{ marginTop: 16 }}>
            {reviewMsg && <div className="success-banner">{reviewMsg}</div>}
            <div className="field">
              <label>Your rating</label>
              <select value={review.rating} onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}>
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} star{n > 1 ? "s" : ""}</option>)}
              </select>
            </div>
            <div className="field">
              <label>Comment</label>
              <textarea rows={3} value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} />
            </div>
            <button className="btn btn-primary btn-sm">Submit review</button>
          </form>
        )}
      </section>
    </main>
  );
}
