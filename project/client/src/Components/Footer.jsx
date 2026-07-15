export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        Bindery &amp; Co. — a MERN stack book shop, built as a group project. © {new Date().getFullYear()}.
      </div>
    </footer>
  );
}
