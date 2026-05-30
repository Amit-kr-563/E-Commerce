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
  originalPrice: Number, // Store original price without discount
  bulkDiscount: { type: Number, default: 0 }, // Discount percentage (0, 15, or 20)
  quantity: { type: Number, default: 1 }
});

// Create unique index on username and productId to prevent duplicates
cartSchema.index({ username: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model("Cart", cartSchema);
