const express = require('express');
const Wishlist = require('../models/Wishlist');
const verifyToken = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', verifyToken, async (req, res) => {
  try {
    const { product_id } = req.body;
    const user_id = req.user.id;

    // Check if already in wishlist
    const exists = await Wishlist.findOne({ user_id, product_id });
    if (exists) return res.status(400).json({ message: 'Already in wishlist' });

    const newItem = new Wishlist({ user_id, product_id });
    await newItem.save();
    res.status(201).json({ message: 'Added to wishlist' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:product_id', verifyToken, async (req, res) => {
    try {
      const product_id = parseInt(req.params.product_id); // Convert to number
      const user_id = req.user.id;
  
      const result = await Wishlist.deleteOne({ user_id, product_id });
  
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Item not found in wishlist' });
      }
  
      res.status(200).json({ message: 'Removed from wishlist' });
    } catch (err) {
      console.error("Remove error:", err);
      res.status(500).json({ message: "Failed to remove from wishlist" });
    }
  });


router.get('/', verifyToken, async (req, res) => {
  try {
    const user_id = req.user.id;
    const wishlist = await Wishlist.find({ user_id });
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch wishlist' });
  }
});

module.exports = router;