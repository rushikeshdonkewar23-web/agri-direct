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

// 1. Get All Products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products', error: err.message });
  }
});

// 2. Add Crop (Safe POST Endpoint)
router.post('/', async (req, res) => {
  try {
    const { title, category, district, price, unit, quantityAvailable, phone, image } = req.body;

    // जर इमेज डेटा उपलब्ध नसेल तर डिफॉल्ट इमेज
    let finalImage = image;
    if (!finalImage || finalImage.length < 10) {
      finalImage = 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500';
    }

    const newProduct = new Product({
      title: title || 'Fresh Crop',
      category: category || 'Vegetables',
      district: district || 'Maharashtra',
      price: Number(price) || 0,
      unit: unit || 'kg',
      quantityAvailable: Number(quantityAvailable) || 1,
      phone: phone || '9022554979',
      image: finalImage
    });

    await newProduct.save();

    return res.status(201).json({
      success: true,
      message: '🎉 Crop published successfully!',
      product: newProduct
    });
  } catch (err) {
    console.error("Add Product Error:", err);
    return res.status(500).json({ 
      message: 'Failed to publish crop', 
      error: err.message 
    });
  }
});

module.exports = router;