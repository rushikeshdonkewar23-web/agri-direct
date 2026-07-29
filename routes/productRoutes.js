const express = require('express');
const router = express.Router();

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

// Get All Products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
});

// Add Crop Endpoint (Safe from 500 Internal Server Error)
router.post('/', async (req, res) => {
  try {
    const body = req.body || {};

    const newProduct = new Product({
      title: body.title || 'Fresh Crop',
      category: body.category || 'Vegetables',
      district: body.district || 'Nanded',
      price: Number(body.price) || 0,
      unit: body.unit || 'kg',
      quantityAvailable: Number(body.quantityAvailable || body.stock || 100),
      phone: body.phone || '9022554979',
      image: body.image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500'
    });

    await newProduct.save();

    return res.status(201).json({
      success: true,
      message: '🎉 Crop published successfully!',
      product: newProduct
    });
  } catch (err) {
    console.error("500 Server Error Details:", err.message);
    return res.status(500).json({ 
      message: 'Failed to publish crop', 
      error: err.message 
    });
  }
});

module.exports = router;