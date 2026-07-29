const express = require('express');
const router = express.Router();

// Product Model Import (Try-Catch Safe)
let Product;
try {
  Product = require('../models/Product');
} catch (e) {
  try {
    Product = require('../models/product');
  } catch (err) {
    console.error("Product Model Import Error:", err);
  }
}

// 1. Get All Products (मार्केटप्लेसवर सर्व पिके दाखवण्यासाठी)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("Fetch Products Error:", err);
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
});

// 2. Add / Publish New Crop (विना ऑथरायझेशन एरर नवीन पीक थेट सेव्ह करणे)
router.post('/', async (req, res) => {
  try {
    const { title, category, district, price, unit, quantityAvailable, phone, image } = req.body;

    if (!title || !price) {
      return res.status(400).json({ message: 'कृपया पिकाचे नाव आणि किंमत टाका!' });
    }

    const newProduct = new Product({
      title,
      category: category || 'General',
      district: district || 'Maharashtra',
      price: Number(price),
      unit: unit || 'kg',
      quantityAvailable: Number(quantityAvailable) || 1,
      phone: phone || '',
      image: image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500'
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: '🎉 Crop published successfully!',
      product: newProduct
    });
  } catch (err) {
    console.error("Add Product Error:", err);
    res.status(500).json({ message: 'Failed to publish crop', error: err.message });
  }
});

module.exports = router;