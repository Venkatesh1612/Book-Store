// Displays a single order's items and status — used in MyOrders and confirmation pages.
export default function OrderItem({ order }) {
  return (
    <div className="card" style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div>
          <p className="section-label" style={{ marginBottom: 2 }}>Order #{order._id.slice(-6).toUpperCase()}</p>
          <span style={{ fontFamily: "var(--font-ui)", fontSize: "0.8rem", color: "var(--ink-soft)" }}>
            Placed {new Date(order.createdAt).toLocaleDateString()}
          </span>
        </div>
        <span className={`status-pill status-${order.status}`}>{order.status}</span>
      </div>
      <table className="data-table">
        <thead>
          <tr><th>Title</th><th>Format</th><th>Qty</th><th>Price</th></tr>
        </thead>
        <tbody>
          {order.items.map((item, idx) => (
            <tr key={idx}>
              <td>{item.title}</td>
              <td style={{ textTransform: "capitalize" }}>{item.format}</td>
              <td>{item.quantity}</td>
              <td>${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ textAlign: "right", marginTop: 10, fontFamily: "var(--font-ui)", fontWeight: 600 }}>
        Total: ${order.totalPrice.toFixed(2)}
      </div>
    </div>
  );
}
