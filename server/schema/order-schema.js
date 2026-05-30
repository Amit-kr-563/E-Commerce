const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  username: String,
  fullName: String,
  email: String,
  mobile: String,
  address: String,
  paymentMethod: String,
  bank: String,
  totalAmount: Number,
  cartItems: [
    {
      productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product' 
      },
      sellerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
      },
      name: String,
      price: Number,
      quantity: Number,
      img: String,
      status: { 
        type: String, 
        enum: ['Ordered', 'Dispatched', 'Delivered', 'Cancelled'],
        default: 'Ordered'
      }
    }
  ],
  status: { 
    type: String, 
    enum: ['Pending', 'Processing', 'Completed', 'Cancelled'],
    default: 'Pending'
  }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
