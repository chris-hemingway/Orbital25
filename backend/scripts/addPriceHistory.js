const mongoose = require('mongoose');

require("dotenv").config();
console.log('MONGO_URI:', process.env.MONGO_URI); // debug

const ProductV2 = require('../models/ProductV2');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function addInitialPriceHistory() {
  try {
    const products = await ProductV2.find({ price_history: { $exists: false } });

    for (const product of products) {
      product.price_history = [
        {
          price: product.current_price,
          date: product.last_update || new Date(),
        },
      ];
      await product.save();
    }

    console.log(`✅ Updated ${products.length} products with initial price history.`);
  } catch (err) {
    console.error('❌ Error updating products:', err);
  } finally {
    mongoose.disconnect();
  }
}

addInitialPriceHistory();