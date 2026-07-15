import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Profile() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const { profile } = useAuth();

  useEffect(() => {
    api.get("/users/profile").then((res) => setForm({ name: res.data.name, email: res.data.email, password: "" }));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const payload = { name: form.name, email: form.email };
      if (form.password) payload.password = form.password;
      await api.put("/users/profile", payload);
      setMsg("Profile updated.");
    } catch (err) {
      setMsg(err.response?.data?.message || "Could not update profile.");
    }
  };

  return (
    <main className="page container">
      <div className="form-page card">
        <p className="section-label">Account</p>
        <h2>Your profile</h2>
        {msg && <div className="success-banner">{msg}</div>}
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} />
          </div>
          <div className="field">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} />
          </div>
          <div className="field">
            <label>New password (optional)</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Leave blank to keep current password" />
          </div>
          <button className="btn btn-primary" style={{ width: "100%" }}>Save changes</button>
        </form>
      </div>
    </main>
  );
}
