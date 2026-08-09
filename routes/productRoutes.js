const express = require('express');
const router = express.Router();

// Safe Model Import Logic
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

// 1. Get All Products
router.get('/', async (req, res) => {
  try {
    if (!Product) {
      return res.status(500).json({ message: "Product Model not loaded properly" });
    }
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("Fetch Products Error:", err);
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
});

// 1.5 Get Single Product By ID
router.get('/:id', async (req, res) => {
  try {
    if (!Product) {
      return res.status(500).json({ message: "Product Model not loaded properly" });
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error("Fetch Product Details Error:", err);
    res.status(500).json({ message: 'Error fetching product details', error: err.message });
  }
});

// 2. Add Crop Endpoint (Safe from 500 Error)
router.post('/', async (req, res) => {
  try {
    if (!Product) {
      return res.status(500).json({ message: "Product Model not loaded" });
    }

    const body = req.body || {};
    console.log("Incoming Crop Data:", body);

    // Schema Safe Casting
    const newProduct = new Product({
      title: body.title || 'Fresh Crop',
      category: body.category || 'Vegetables',
      district: body.district || 'Nanded',
      price: Number(body.price) || 0,
      unit: body.unit || 'kg',
      // Number किंवा String दोन्ही स्वीकारण्यासाठी safe string fallback:
      quantityAvailable: String(body.quantityAvailable || body.stock || body.quantity || '100'),
      phone: body.phone || '9022554979',
      image: body.image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500'
    });

    const savedProduct = await newProduct.save();

    return res.status(201).json({
      success: true,
      message: '🎉 Crop published successfully!',
      product: savedProduct
    });
  } catch (err) {
    console.error("500 Server Error Details:", err);
    return res.status(500).json({ 
      message: 'Failed to publish crop', 
      error: err.message 
    });
  }
});

// 3. Delete Crop Endpoint
router.delete('/:id', async (req, res) => {
  try {
    if (!Product) {
      return res.status(500).json({ message: "Product Model not loaded" });
    }
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Crop deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: "Error deleting crop", error: err.message });
  }
});

module.exports = router;