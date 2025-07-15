const express = require('express');
const router = express.Router();
const PriceAlert = require('../models/PriceAlert');
const verifyToken = require('../middleware/authMiddleware'); 

// Set a new price alert
router.post('/', verifyToken, async (req, res) => {
  const { product, target_price } = req.body;
  const user_id = req.user.id;

  try {
    // Check for duplicate
    const existing = await PriceAlert.findOne({ user_id, product, target_price });

    if (existing) {
      return res.status(400).json({
        error: 'You already have an alert set at this price for this product.'
      });
    }

    const newAlert = new PriceAlert({ user_id, product, target_price });
    await newAlert.save();
    res.status(201).json(newAlert);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to set alert.' });
  }
});

// Get all alerts for current user
router.get('/', verifyToken, async (req, res) => {
  try {
    const alerts = await PriceAlert.find({ user_id: req.user.id }).populate('product');
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch alerts.' });
  }
});

// Delete alert
router.delete('/:id', verifyToken, async (req, res) => {
    try {
      const alert = await PriceAlert.findOneAndDelete({
        _id: req.params.id,
        user_id: req.user.id
      });
  
      if (!alert) {
        return res.status(404).json({ error: 'Alert not found or unauthorized' });
      }
  
      res.status(200).json({ message: 'Alert deleted' });
    } catch (err) {
      console.error('Error deleting alert:', err);
      res.status(500).json({ error: 'Failed to delete alert' });
    }
  });

module.exports = router;