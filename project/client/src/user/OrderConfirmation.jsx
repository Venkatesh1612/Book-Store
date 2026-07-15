import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios.js";
import OrderItem from "./OrderItem.jsx";

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then((res) => setOrder(res.data));
  }, [id]);

  return (
    <main className="page container">
      <div className="success-banner" style={{ maxWidth: 600 }}>
        Your order was placed successfully. A confirmation has been recorded to your account.
      </div>
      <h2>Order confirmation</h2>
      {order ? <OrderItem order={order} /> : <p>Loading your order…</p>}
      <Link className="btn btn-outline" to="/my-orders">View all orders</Link>
    </main>
  );
}
