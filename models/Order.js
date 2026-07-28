const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: false
  },
  buyerName: {
    type: String,
    required: true
  },
  quantity: {
    type: String,
    required: true
  },
  buyerPhone: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'Placed'
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);