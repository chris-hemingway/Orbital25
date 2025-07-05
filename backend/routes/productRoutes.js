const express = require('express');
const Product = require('../models/ProductV2'); //V2
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const products = await Product.find({});
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching productsV2' });
    }
});

module.exports = router;