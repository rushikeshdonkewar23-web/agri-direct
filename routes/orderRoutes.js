const express = require('express');
const router = express.Router();

// Order Model Try-Catch Safe Import
let Order;
try {
  Order = require('../models/Order');
} catch (e) {
  try {
    Order = require('../models/order');
  } catch (err) {
    console.error("Order Model Not Found!");
  }
}

// 1. Create Order Route (कोणताही Auth Check न ठेवता थेट ऑर्डर प्लेस करणे)
router.post('/', async (req, res) => {
  try {
    const { productId, buyerName, quantity, buyerPhone } = req.body;

    if (!buyerName || !quantity || !buyerPhone) {
      return res.status(400).json({ message: 'कृपया सर्व माहिती भरा!' });
    }

    const newOrder = new Order({
      product: productId || null,
      buyerName,
      quantity,
      buyerPhone,
      status: 'Placed'
    });

    await newOrder.save();

    res.status(201).json({
      success: true,
      message: '🎉 Order placed successfully!',
      order: newOrder
    });
  } catch (err) {
    console.error('Order Error:', err);
    res.status(500).json({ message: 'Order save करताना एरर आला', error: err.message });
  }
});

// 2. Get All Orders Route (ऑर्डर्स दाखवण्यासाठी)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Fetch Orders Error:', err);
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
});

module.exports = router;