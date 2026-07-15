const Book = require("../models/Book");
const Seller = require("../models/Seller");

// GET /api/books  (public: view + filter by genre/author/search)
exports.getBooks = async (req, res) => {
  try {
    const { genre, author, search } = req.query;
    const filter = {};
    if (genre) filter.genres = genre;
    if (author) filter.authors = author;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { authors: { $regex: search, $options: "i" } },
      ];
    }

    const books = await Book.find(filter).populate("seller", "businessName");
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch books.", error: err.message });
  }
};

// GET /api/books/:id
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("seller", "businessName");
    if (!book) return res.status(404).json({ message: "Book not found." });
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch book.", error: err.message });
  }
};

// POST /api/books  (seller)
exports.createBook = async (req, res) => {
  try {
    const { title, authors, genres, description, price, quantity } = req.body;
    if (!title || !price) {
      return res.status(400).json({ message: "Title and price are required." });
    }

    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const book = await Book.create({
      title,
      authors: Array.isArray(authors) ? authors : authors ? authors.split(",").map((a) => a.trim()) : [],
      genres: Array.isArray(genres) ? genres : genres ? genres.split(",").map((g) => g.trim()) : [],
      description,
      price,
      quantity: quantity || 0,
      image,
      seller: req.user.id,
    });

    await Seller.findByIdAndUpdate(req.user.id, { $push: { books: book._id } });

    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ message: "Could not create book listing.", error: err.message });
  }
};

// PUT /api/books/:id (seller, owner only)
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found." });
    if (book.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only edit your own book listings." });
    }

    const { title, authors, genres, description, price, quantity } = req.body;
    if (title) book.title = title;
    if (authors) book.authors = Array.isArray(authors) ? authors : authors.split(",").map((a) => a.trim());
    if (genres) book.genres = Array.isArray(genres) ? genres : genres.split(",").map((g) => g.trim());
    if (description) book.description = description;
    if (price) book.price = price;
    if (quantity !== undefined) book.quantity = quantity;
    if (req.file) book.image = `/uploads/${req.file.filename}`;

    await book.save();
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: "Could not update book.", error: err.message });
  }
};

// DELETE /api/books/:id (seller owner, or admin)
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found." });

    if (req.user.role === "seller" && book.seller.toString() !== req.user.id) {
      return res.status(403).json({ message: "You can only delete your own book listings." });
    }

    await Book.findByIdAndDelete(req.params.id);
    await Seller.findByIdAndUpdate(book.seller, { $pull: { books: book._id } });

    res.json({ message: "Book removed." });
  } catch (err) {
    res.status(500).json({ message: "Could not delete book.", error: err.message });
  }
};

// GET /api/books/seller/mine (seller)
exports.getMyBooks = async (req, res) => {
  try {
    const books = await Book.find({ seller: req.user.id });
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch your books.", error: err.message });
  }
};

// POST /api/books/:id/review (user)
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found." });

    book.ratings.push({ user: req.user.id, rating, comment });
    book.recalculateAverageRating();
    await book.save();

    res.json(book);
  } catch (err) {
    res.status(500).json({ message: "Could not submit review.", error: err.message });
  }
};
