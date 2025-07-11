const express = require("express");
const router = express.Router();
const Review = require("../models/Review");
const verifyToken = require("../middleware/authMiddleware");

// GET reviews for a product
router.get("/:product_id", async (req, res) => {
  try {
    const reviews = await Review.find({ product_id: req.params.product_id }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
});

// POST new review for a product (auth required)
router.post("/:product_id", verifyToken, async (req, res) => {
  const { rating, comment } = req.body;
  const { username, id: user_id } = req.user;

  if (!rating || !comment) {
    return res.status(400).json({ message: "Rating and comment are required." });
  }

  try {
    const newReview = new Review({
      product_id: req.params.product_id,
      user_id,
      username,
      rating,
      comment,
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to post review." });
  }
});

module.exports = router;
