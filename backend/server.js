const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const productRoutes = require('./routes/productRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const priceAlert = require('./routes/priceAlerts');

const PORT = process.env.PORT || 8080;

const app = express();
const allowedOrigins = ["http://localhost:5173", "http://localhost:3000", "https://orbital-frontend-987150758714.asia-southeast1.run.app" ];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

app.use('/api/products', productRoutes);

app.use('/api/auth', authRoutes);

app.use('/api/wishlist', wishlistRoutes);

app.use('/api/reviews', reviewRoutes);

app.use('/api/alerts', priceAlert);

console.log("Loaded ENV values:");
console.log("PORT:", process.env.PORT);
console.log("MONGO_URI:", process.env.MONGO_URI ? "(found)" : "(missing)");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "(found)" : "(missing)");


app.options("*", cors());


app.use((req, res, next) => {
  console.log(`Incoming: ${req.method} ${req.url}`);
  next();
});


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((err) => console.error("MongoDB error:", err));
