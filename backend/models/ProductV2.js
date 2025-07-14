const mongoose = require('mongoose');

const productV2Schema = new mongoose.Schema({
    product_id: Number,
    name: String,
    current_price: Number,
    rating: Number,
    num_reviews: Number,
    link: String,
    image_url: String,
    store_name: String,
    last_update: Date,
    price_history: [
        {
            price: Number,
            date: { type: Date, default: Date.now }
        }
    ]
});

module.exports = mongoose.model('ProductV2', productV2Schema, 'productv3');