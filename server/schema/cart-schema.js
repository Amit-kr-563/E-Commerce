const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  username: String,
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' 
  },
  sellerId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' 
  },
  name: String,
  img: String,
  price: Number,
  originalPrice: Number, 
  bulkDiscount: { type: Number, default: 0 }, 
  quantity: { type: Number, default: 1 }
});

cartSchema.index({ username: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model("Cart", cartSchema);
