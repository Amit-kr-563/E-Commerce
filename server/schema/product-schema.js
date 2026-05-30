const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  img: { type: String, required: true }, // Main/front image
  images: { type: [String], default: [] }, // Additional images
  price: { type: Number, required: true },
  originalprice: { type: Number, required: true },
  discount: { type: String },
  category: { 
    type: String,
    required: true 
  },
  subcategory: { 
    type: String,
    required: true 
  },
  description: { type: String },
  specifications: {
    type: Map,
    of: String,
    default: new Map()
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stock: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
