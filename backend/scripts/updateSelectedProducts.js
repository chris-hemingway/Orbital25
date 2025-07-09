require('dotenv').config();
const mongoose = require('mongoose');
const puppeteer = require('puppeteer');
const Product = require('../models/ProductV3');

const productsToScrape = [
    {
        product_id: 184,
        url: "https://www.lazada.sg//www.lazada.sg/products/pdp-i1250364037.html",
        platform: "lazada"
      },
      {
        product_id: 229,
        url: "https://www.lazada.sg//www.lazada.sg/products/pdp-i2581444532.html",
        platform: "lazada"
      },
      {
        product_id: 95,
        url: "https://www.amazon.sg/Sony-WH-CH520-Wireless-Bluetooth-Headphones/dp/B0BS1PRC4L",
        platform: "amazon"
      },
      {
        product_id: 79,
        url: "https://www.amazon.sg/Nike-Force-Basketball-Shoe-Black/dp/B000UE0QXC",
        platform: "amazon"
      }
 ];

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    scrapeAndUpdate();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

async function scrapeAndUpdate() {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox'
    ]
  });

  const page = await browser.newPage();

  for (const item of productsToScrape) {
    try {
      console.log(`Scraping product ${item.product_id} from ${item.platform}`);
      await page.goto(item.url, { waitUntil: 'networkidle2', timeout: 0 });

      let result = {};

      if (item.platform === 'lazada') {
        result = await page.evaluate(() => {
          const priceText = document.querySelector('.pdp-price')?.textContent;
          const ratingText = document.querySelector('.score-average')?.textContent;
          const reviewText = document.querySelector('.pdp-review-summary .count')?.textContent;

          return {
            price: parseFloat(priceText?.replace(/[^\d.]/g, '') || 0),
            rating: parseFloat(ratingText || 0),
            num_reviews: parseInt(reviewText?.replace(/[^\d]/g, '') || 0)
          };
        });
      } else if (item.platform === 'amazon') {
        result = await page.evaluate(() => {
          const priceText = document.querySelector('.a-price .a-offscreen')?.textContent;
          const ratingText = document.querySelector('.a-icon-alt')?.textContent;
          const reviewText = document.querySelector('#acrCustomerReviewText')?.textContent;

          return {
            price: parseFloat(priceText?.replace(/[^\d.]/g, '') || 0),
            rating: parseFloat(ratingText?.split(' ')[0] || 0),
            num_reviews: parseInt(reviewText?.replace(/[^\d]/g, '') || 0)
          };
        });
      }

      const product = await Product.findOne({ product_id: item.product_id });

      if (!product) {
        console.log(`Product ID ${item.product_id} not found`);
        continue;
      }

      if (result.price && result.price !== product.current_price) {
        product.price_history.push({
          price: product.current_price,
          date: new Date()
        });
        product.current_price = result.price;
      }

      product.rating = result.rating || product.rating;
      product.num_reviews = result.num_reviews || product.num_reviews;
      product.last_update = new Date();

      await product.save();
      console.log(`Updated product ${item.product_id}`);
    } catch (err) {
      console.error(`Error scraping product ${item.product_id}:`, err.message);
    }
  }

  await browser.close();
  console.log('Browser closed');
  mongoose.disconnect();
  console.log('Disconnected from MongoDB');

  setTimeout(() => {
    console.log('No lingering processes, exiting manually.');
    process.exit(0);
  }, 5000); // Allow 5 seconds for cleanup
  
}