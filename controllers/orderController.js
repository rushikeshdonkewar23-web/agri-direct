const Order = require('../models/Order');
const Product = require('../models/Product');

// Place New Order
exports.createOrder = async (req, res) => {
  try {
    const { productId, quantity, deliveryAddress } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (quantity > product.quantityAvailable) {
      return res.status(400).json({ message: 'Requested quantity not available' });
    }

    const totalPrice = product.price * quantity;

    const order = new Order({
      buyer: req.user._id,
      product: productId,
      quantity,
      totalPrice,
      deliveryAddress,
    });

    const createdOrder = await order.save();

    // Reduce product quantity available
    product.quantityAvailable -= quantity;
    await product.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get My Orders (For Logged-in User)
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id }).populate('product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};