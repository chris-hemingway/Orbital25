const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    product_id: Number,
    name: String,
    current_price: Number,
    rating: Number,
    num_reviews: Number,
    link: String,
    image_url: String,
    store_name: String,
    last_update: Date,
});

module.exports = mongoose.model('Product', productSchema, 'products');