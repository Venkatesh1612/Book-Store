import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-spines" aria-hidden="true">
            {Array.from({ length: 9 }).map((_, i) => (
              <div className="spine" key={i} style={{ height: `${60 + ((i * 37) % 40)}%`, alignSelf: "flex-end" }} />
            ))}
          </div>
          <div>
            <p className="section-label" style={{ color: "var(--brass-light)" }}>Welcome to the shelf</p>
            <h1>Every book has a seller, a story, and a next reader.</h1>
            <p>
              Browse a growing collection curated by independent sellers, filter by genre or author,
              and track your order from cart to doorstep.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
              <Link className="btn btn-accent" to="/books">Browse books</Link>
              <Link className="btn btn-outline" style={{ borderColor: "var(--paper-dim)", color: "var(--paper)" }} to="/signup">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </section>

      <main className="page container">
        <div className="dash-header">
          <div>
            <p className="section-label">How it works</p>
            <h2 style={{ margin: 0 }}>Three roles, one shelf</h2>
          </div>
        </div>
        <div className="book-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
          <div className="card">
            <h3>Readers</h3>
            <p style={{ fontFamily: "var(--font-ui)", color: "var(--ink-soft)" }}>
              Sign up, browse by genre or author, add books to your cart, and track every order.
            </p>
            <Link className="btn btn-primary btn-sm" to="/signup">Join as a reader</Link>
          </div>
          <div className="card">
            <h3>Sellers</h3>
            <p style={{ fontFamily: "var(--font-ui)", color: "var(--ink-soft)" }}>
              List new titles, manage inventory, and fulfil orders from your own dashboard.
            </p>
            <Link className="btn btn-accent btn-sm" to="/seller/signup">Become a seller</Link>
          </div>
          <div className="card">
            <h3>Admins</h3>
            <p style={{ fontFamily: "var(--font-ui)", color: "var(--ink-soft)" }}>
              Approve sellers, oversee listings, and keep the whole store running smoothly.
            </p>
            <Link className="btn btn-outline btn-sm" to="/admin/login">Admin sign in</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
