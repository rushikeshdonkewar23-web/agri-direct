const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, default: 'Crop' },
  category: { type: String, default: 'Vegetables' },
  price: { type: Number, default: 0 },
  unit: { type: String, default: 'kg' },
  quantityAvailable: { type: Number, default: 1 },
  district: { type: String, default: 'Maharashtra' },
  phone: { type: String, default: '9022554979' },
  image: { type: String, default: '' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);