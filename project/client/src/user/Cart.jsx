import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";
import { useCart } from "../context/CartContext.jsx";

export default function Cart() {
  const { items, updateQuantity, removeItem, clearCart, total } = useCart();
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    setError("");
    setPlacing(true);
    try {
      const payload = {
        items: items.map((i) => ({ bookId: i.book._id, quantity: i.quantity, format: i.format })),
      };
      const { data } = await api.post("/orders", payload);
      clearCart();
      navigate(`/order-confirmation/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not place your order.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <main className="page container">
      <div className="dash-header">
        <h2 style={{ margin: 0 }}>Your cart</h2>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {items.length === 0 ? (
        <div className="empty-state">Your cart is empty. Go find something worth reading.</div>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr><th>Title</th><th>Format</th><th>Quantity</th><th>Price</th><th></th></tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr key={i.book._id}>
                  <td>{i.book.title}</td>
                  <td style={{ textTransform: "capitalize" }}>{i.format}</td>
                  <td>
                    <input
                      type="number"
                      min={1}
                      max={i.book.quantity}
                      value={i.quantity}
                      onChange={(e) => updateQuantity(i.book._id, Number(e.target.value))}
                      style={{ width: 60, padding: 6, border: "1px solid var(--line)", borderRadius: 3 }}
                    />
                  </td>
                  <td>${(i.book.price * i.quantity).toFixed(2)}</td>
                  <td><button className="btn btn-outline btn-sm" onClick={() => removeItem(i.book._id)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20, alignItems: "center", gap: 16 }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem" }}>Total: ${total.toFixed(2)}</span>
            <button className="btn btn-accent" disabled={placing} onClick={handleCheckout}>
              {placing ? "Placing order…" : "Place order"}
            </button>
          </div>
        </>
      )}
    </main>
  );
}
