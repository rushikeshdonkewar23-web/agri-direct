const express = require('express');
const router = express.Router();

// Order Model (तुमचा मॉडेल इम्पोर्ट करा)
let Order;
try {
  Order = require('../models/Order');
} catch (e) {
  Order = require('../models/order');
}

// 1. Create Order Route
router.post('/', async (req, res) => {
  try {
    const { productId, buyerName, quantity, buyerPhone } = req.body;
    const newOrder = new Order({
      product: productId,
      buyerName,
      quantity,
      buyerPhone
    });
    await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully', order: newOrder });
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ message: 'Failed to place order', error: err.message });
  }
});

// 2. Get All Orders Route
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Fetch orders error:', err);
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
});

module.exports = router;