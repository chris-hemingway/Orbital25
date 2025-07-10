const express = require("express");
const mongoose = require("mongoose");
const scrapeAndUpdate = require("./updateSelectedProducts");

const app = express();
const PORT = process.env.PORT || 8080;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("MongoDB connected");
}).catch(console.error);

app.get("/", async (req, res) => {
  try {
    await scrapeAndUpdate(); // function that does all the scraping and updating
    res.status(200).send("Scraping completed successfully.");
  } catch (error) {
    console.error("Scraping error:", error);
    res.status(500).send("Scraping failed.");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});