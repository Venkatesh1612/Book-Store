const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema(
  {
    businessName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, default: "seller" },
    approved: { type: Boolean, default: false },
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
    rating: { type: Number, default: 0, min: 0, max: 5 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Seller", sellerSchema);
