const express = require('express');
const router = express.Router();
const PriceAlert = require('../models/PriceAlert');
const verifyToken = require('../middleware/authMiddleware');
const Product = require('../models/ProductV3');
const auth = require('../middleware/authMiddleware'); 

// Set a new price alert
router.post('/', verifyToken, async (req, res) => {
  const { product, target_price } = req.body;
  const user_id = req.user.id;

  try {
    // Check for duplicate/existing alerts
    const existing = await PriceAlert.findOne({ user_id, product });

    if (existing) {
        existing.target_price = target_price;
        await existing.save();
        return res.json({ message: 'Price alert updated', existing });
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

// Check for triggered alerts
router.get('/triggered', auth, async (req, res) => {
    try {
      const alerts = await PriceAlert.find({ user_id: req.user.id }).populate('product');
  
      const triggeredAlerts = alerts.filter(alert =>
        alert.product && alert.product.current_price <= alert.target_price
      );
  
      res.json(triggeredAlerts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to check triggered alerts' });
    }
  });

module.exports = router;