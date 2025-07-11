const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  product_id: { type: String, required: true }, // match with your frontend's product.product_id
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  username: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Review", reviewSchema);
