import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Ssignup() {
  const [form, setForm] = useState({ businessName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/sellers/signup", form);
      login(data.token, "seller", data.seller);
      navigate("/seller/home");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create your seller account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page container">
      <div className="form-page card">
        <p className="section-label">Seller account</p>
        <h2>Become a seller</h2>
        {error && <div className="error-banner">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Business name</label>
            <input name="businessName" value={form.businessName} onChange={handleChange} required />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} />
          </div>
          <button className="btn btn-accent" style={{ width: "100%" }} disabled={loading}>
            {loading ? "Creating account…" : "Sign up"}
          </button>
        </form>
        <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.88rem", marginTop: 16 }}>
          Already selling with us? <Link to="/seller/login">Log in</Link>
        </p>
      </div>
    </main>
  );
}
