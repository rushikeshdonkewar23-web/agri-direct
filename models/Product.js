const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Product title is required'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'], // e.g. Vegetables, Fruits, Grains
    },
    price: {
      type: Number,
      required: [true, 'Price per unit is required'],
    },
    unit: {
      type: String,
      required: [true, 'Unit is required'], // e.g. kg, ton, quintal
    },
    quantityAvailable: {
      type: Number,
      required: [true, 'Quantity is required'],
    },
    district: {
      type: String,
      required: [true, 'District is required'],
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/150',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);