const Order = require("../models/Order");
const Book = require("../models/Book");
const User = require("../models/User");

// POST /api/orders  (user checks out the cart)
exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body; // [{ bookId, quantity, format }]
    if (!items || !items.length) {
      return res.status(400).json({ message: "Your cart is empty." });
    }

    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      const book = await Book.findById(item.bookId);
      if (!book) return res.status(404).json({ message: `Book not found: ${item.bookId}` });
      if (book.quantity < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for "${book.title}".` });
      }

      orderItems.push({
        book: book._id,
        title: book.title,
        quantity: item.quantity,
        price: book.price,
        format: item.format || "paperback",
      });
      totalPrice += book.price * item.quantity;

      book.quantity -= item.quantity;
      await book.save();
    }

    const order = await Order.create({ user: req.user.id, items: orderItems, totalPrice });
    await User.findByIdAndUpdate(req.user.id, { $push: { orders: { order: order._id } } });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Could not place order.", error: err.message });
  }
};

// GET /api/orders/mine (user)
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch your orders.", error: err.message });
  }
};

// GET /api/orders/:id
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");
    if (!order) return res.status(404).json({ message: "Order not found." });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch order.", error: err.message });
  }
};

// GET /api/orders (admin: all orders)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Could not fetch orders.", error: err.message });
  }
};
