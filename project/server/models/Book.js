const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    authors: [{ type: String, trim: true }],
    genres: [{ type: String, trim: true }],
    description: { type: String, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, default: 0, min: 0 },
    image: { type: String, default: "" },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
    ratings: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
        comment: { type: String, trim: true },
      },
    ],
    averageRating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

bookSchema.methods.recalculateAverageRating = function () {
  if (!this.ratings.length) {
    this.averageRating = 0;
    return;
  }
  const total = this.ratings.reduce((sum, r) => sum + r.rating, 0);
  this.averageRating = Math.round((total / this.ratings.length) * 10) / 10;
};

module.exports = mongoose.model("Book", bookSchema);
