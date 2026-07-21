const Product = require('../models/Product');

// 1. Create Product (Farmer)
exports.createProduct = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: 'Please provide product details' });
    }

    const { title, category, price, unit, quantityAvailable, district, image } = req.body;

    const product = new Product({
      farmer: req.user._id,
      title,
      category,
      price,
      unit,
      quantityAvailable,
      district,
      image,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Get All Products (All Users)
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate('farmer', 'name phone email');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Delete Product (Only product creator farmer can delete)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if product belongs to logged in farmer
    if (product.farmer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this product' });
    }

    await product.deleteOne();
    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};