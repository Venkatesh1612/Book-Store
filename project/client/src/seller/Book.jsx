// Displays a single book row for the seller's own product list, with edit/delete controls.
export default function Book({ book, onDelete }) {
  return (
    <tr>
      <td>{book.title}</td>
      <td>{(book.authors || []).join(", ")}</td>
      <td>${book.price.toFixed(2)}</td>
      <td>{book.quantity}</td>
      <td>
        <button className="btn btn-danger btn-sm" onClick={() => onDelete(book._id)}>Delete</button>
      </td>
    </tr>
  );
}
