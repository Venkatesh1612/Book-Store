import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Asignup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
      const { data } = await api.post("/admin/signup", form);
      login(data.token, "admin", data.admin);
      navigate("/admin/home");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create admin account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page container">
      <div className="form-page card">
        <p className="section-label">Admin account</p>
        <h2>Create admin account</h2>
        {error && <div className="error-banner">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field"><label>Name</label><input name="name" value={form.name} onChange={handleChange} required /></div>
          <div className="field"><label>Email</label><input type="email" name="email" value={form.email} onChange={handleChange} required /></div>
          <div className="field"><label>Password</label><input type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} /></div>
          <button className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>{loading ? "Creating…" : "Sign up"}</button>
        </form>
        <p style={{ fontFamily: "var(--font-ui)", fontSize: "0.88rem", marginTop: 16 }}>
          Already an admin? <Link to="/admin/login">Log in</Link>
        </p>
      </div>
    </main>
  );
}
