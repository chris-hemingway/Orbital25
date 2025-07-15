require('dotenv').config();
const mongoose = require('mongoose');
const puppeteer = require('puppeteer');
const Product = require('../models/ProductV3');

async function scrapeAndUpdate() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Set user agent
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

  const productsToScrape = await Product.find({
    store_name: 'Amazon'
  });

  console.log(`Found ${productsToScrape.length} Amazon products to scrape.`);

  for (const product of productsToScrape) {
    try {
      console.log(`Scraping product ${product.product_id} from Amazon`);
      
      await page.goto(product.link, { 
        waitUntil: 'domcontentloaded', 
        timeout: 30000
      });

      const result = await page.evaluate(() => {
        // Amazon selectors
        const priceElement = document.querySelector('.a-price .a-offscreen') || 
                            document.querySelector('#priceblock_ourprice') ||
                            document.querySelector('#priceblock_dealprice');
        const priceText = priceElement?.textContent;
        
        const ratingElement = document.querySelector('.a-icon-alt') || 
                            document.querySelector('.reviewCountTextLinkedHistogram');
        const ratingText = ratingElement?.textContent;
        
        const reviewElement = document.querySelector('#acrCustomerReviewText') || 
                            document.querySelector('#averageCustomerReviews_feature_div .a-size-base');
        const reviewText = reviewElement?.textContent;

        return {
          price: parseFloat(priceText?.replace(/[^\d.]/g, '') || 0),
          rating: parseFloat(ratingText?.split(' ')[0] || 0),
          num_reviews: parseInt(reviewText?.replace(/[^\d]/g, '') || 0)
        };
      });

      // Additional checks for Amazon products
      if (!result.price) {
        // Try alternative price location
        const altPrice = await page.evaluate(() => {
          const element = document.querySelector('#twister-plus-price-data-price');
          return element ? parseFloat(element.getAttribute('value')) : 0;
        });
        result.price = altPrice || result.price;
      }

    //   if (!result.price) {
    //     console.warn(`Price not found for product ${product.product_id}`);
    //     await page.screenshot({ path: `debug_${product.product_id}.png` });
    //     continue;
    //   } 
    // ^ for debugging

    if (result.price && result.price !== product.current_price) {
    product.price_history.push({
        price: product.current_price,
        date: new Date()
    });
    product.current_price = result.price;
    } else if (!result.price) {
    console.warn(`Price was 0 or missing for product ${product.product_id}. Keeping previous price.`);
    }

      product.rating = result.rating || product.rating;
      product.num_reviews = result.num_reviews || product.num_reviews;
      product.last_update = new Date();

      await product.save();
      console.log(`Updated product ${product.product_id}`);
    } catch (err) {
      console.error(`Error scraping product ${product.product_id}:`, err.message);
      await page.screenshot({ path: `error_${product.product_id}.png` });
    }
  }

  await browser.close();
  console.log('Browser closed');
  mongoose.disconnect();
  console.log('Disconnected from MongoDB');
  process.exit(0);
}

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
  scrapeAndUpdate();
}).catch(err => {
  console.error('MongoDB connection failed:', err);
});