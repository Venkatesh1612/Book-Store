import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";

export default function Addbook() {
  const [form, setForm] = useState({ title: "", authors: "", genres: "", description: "", price: "", quantity: "" });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (image) data.append("image", image);
      await api.post("/books", data, { headers: { "Content-Type": "multipart/form-data" } });
      navigate("/seller/products");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create this listing.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page container">
      <div className="form-page card" style={{ maxWidth: 520 }}>
        <p className="section-label">New listing</p>
        <h2>Add a book</h2>
        {error && <div className="error-banner">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Title</label>
            <input name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div className="field">
            <label>Author(s), comma separated</label>
            <input name="authors" value={form.authors} onChange={handleChange} />
          </div>
          <div className="field">
            <label>Genre(s), comma separated</label>
            <input name="genres" value={form.genres} onChange={handleChange} placeholder="fiction, romance" />
          </div>
          <div className="field">
            <label>Description</label>
            <textarea rows={4} name="description" value={form.description} onChange={handleChange} />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <div className="field" style={{ flex: 1 }}>
              <label>Price ($)</label>
              <input type="number" step="0.01" min="0" name="price" value={form.price} onChange={handleChange} required />
            </div>
            <div className="field" style={{ flex: 1 }}>
              <label>Quantity</label>
              <input type="number" min="0" name="quantity" value={form.quantity} onChange={handleChange} required />
            </div>
          </div>
          <div className="field">
            <label>Cover image</label>
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <button className="btn btn-accent" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Saving…" : "Create listing"}
          </button>
        </form>
      </div>
    </main>
  );
}
