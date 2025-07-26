const mongoose = require('mongoose');

const priceAlertSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductV3', required: true },
    target_price: { type: Number, required: true },
    triggered: { type: Boolean, default: false },
  });

module.exports = mongoose.model('PriceAlert', priceAlertSchema);