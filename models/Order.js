const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product',
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACCEPTED', 'DELIVERED', 'CANCELLED'],
      default: 'PENDING',
    },
    deliveryAddress: {
      type: String,
      required: [true, 'Delivery address is required'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);