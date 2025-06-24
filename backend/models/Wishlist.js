const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    product_id: { type: Number, required: true }, 
    added_at: { type: Date, default: Date.now },
  });


module.exports = mongoose.model('Wishlist', wishlistSchema);