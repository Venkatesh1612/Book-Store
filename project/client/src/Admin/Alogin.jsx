import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Alogin() {
  const [form, setForm] = useState({ email: "", password: "" });
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
      const { data } = await api.post("/admin/login", form);
      login(data.token, "admin", data.admin);
      navigate("/admin/home");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page container">
      <div className="form-page card">
        <p className="section-label">Admin account</p>
        <h2>Admin log in</h2>
        {error && <div className="error-banner">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field"><label>Email</label><input type="email" name="email" value={form.email} onChange={handleChange} required /></div>
          <div className="field"><label>Password</label><input type="password" name="password" value={form.password} onChange={handleChange} required /></div>
          <button className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>{loading ? "Logging in…" : "Log in"}</button>
        </form>
      </div>
    </main>
  );
}
