const express = require('express');
const router = express.Router();
const { createProduct, getAllProducts, deleteProduct } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getAllProducts)
  .post(protect, createProduct);

router.route('/:id')
  .delete(protect, deleteProduct);

module.exports = router;