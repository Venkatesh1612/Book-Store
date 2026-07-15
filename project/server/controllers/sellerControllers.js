const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Seller = require("../models/Seller");
const Book = require("../models/Book");
const Order = require("../models/Order");

const signToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });

// POST /api/sellers/signup
exports.signup = async (req, res) => {
  try {
    const { businessName, email, password } = req.body;
    if (!businessName || !email || !password) {
      return res.status(400).json({ message: "Business name, email, and password are required." });
    }

    const existing = await Seller.findOne({ email });
    if (existing) return res.status(409).json({ message: "An account with this email already exists." });

    const hashed = await bcrypt.hash(password, 10);
    const seller = await Seller.create({ businessName, email, password: hashed });

    const token = signToken(seller._id, seller.role);
    res.status(201).json({
      token,
      seller: { id: seller._id, businessName: seller.businessName, email: seller.email, approved: seller.approved },
    });
  } catch (err) {
    res.status(500).json({ message: "Could not create seller account.", error: err.message });
  }
};

// POST /api/sellers/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const seller = await Seller.findOne({ email });
    if (!seller) return res.status(401).json({ message: "Invalid email or password." });

    const match = await bcrypt.compare(password, seller.password);
    if (!match) return res.status(401).json({ message: "Invalid email or password." });

    const token = signToken(seller._id, seller.role);
    res.json({
      token,
      seller: { id: seller._id, businessName: seller.businessName, email: seller.email, approved: seller.approved },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed.", error: err.message });
  }
};

// GET /api/sellers/profile
exports.getProfile = async (req, res) => {
  try {
    const seller = await Seller.findById(req.user.id).select("-password").populate("books");
    if (!seller) return res.status(404).json({ message: "Seller not found." });
    res.json(seller);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch profile.", error: err.message });
  }
};

// PUT /api/sellers/profile
exports.updateProfile = async (req, res) => {
  try {
    const { businessName, email, password } = req.body;
    const update = {};
    if (businessName) update.businessName = businessName;
    if (email) update.email = email;
    if (password) update.password = await bcrypt.hash(password, 10);

    const seller = await Seller.findByIdAndUpdate(req.user.id, update, { new: true }).select("-password");
    res.json(seller);
  } catch (err) {
    res.status(500).json({ message: "Could not update profile.", error: err.message });
  }
};

// GET /api/sellers/orders  (orders that include this seller's books)
exports.getSellerOrders = async (req, res) => {
  try {
    const myBooks = await Book.find({ seller: req.user.id }).select("_id");
    const bookIds = myBooks.map((b) => b._id.toString());

    const orders = await Order.find({ "items.book": { $in: bookIds } })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch orders.", error: err.message });
  }
};

// PUT /api/sellers/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found." });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Could not update order status.", error: err.message });
  }
};

// GET /api/sellers  (admin)
exports.getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.find().select("-password");
    res.json(sellers);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch sellers.", error: err.message });
  }
};

// PUT /api/sellers/:id/approve (admin)
exports.approveSeller = async (req, res) => {
  try {
    const seller = await Seller.findByIdAndUpdate(req.params.id, { approved: true }, { new: true }).select("-password");
    res.json(seller);
  } catch (err) {
    res.status(500).json({ message: "Could not approve seller.", error: err.message });
  }
};

// DELETE /api/sellers/:id (admin)
exports.deleteSeller = async (req, res) => {
  try {
    await Seller.findByIdAndDelete(req.params.id);
    res.json({ message: "Seller removed." });
  } catch (err) {
    res.status(500).json({ message: "Could not delete seller.", error: err.message });
  }
};
