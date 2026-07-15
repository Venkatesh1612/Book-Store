import { Link } from "react-router-dom";

// A single book card used in listing grids.
export default function Uitem({ book }) {
  return (
    <Link to={`/books/${book._id}`} className="book-card">
      <div className="book-cover">
        {book.image ? <img src={book.image} alt={book.title} /> : <span>{book.title}</span>}
      </div>
      <div className="book-info">
        <div className="book-title">{book.title}</div>
        <div className="book-author">{(book.authors || []).join(", ") || "Unknown author"}</div>
        <div className="book-price">${Number(book.price).toFixed(2)}</div>
      </div>
    </Link>
  );
}
