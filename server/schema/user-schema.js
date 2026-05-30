const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Basic Information
  name: { type: String },
  email: { type: String },
  mobile: { type: String },
  password: { type: String },
  role: { 
    type: String, 
    enum: ['user', 'seller'], 
    default: 'user' 
  },
  
  // Address Information (Common)
  addressLine: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  
  // User-specific fields
  dob: { type: String },
  gender: { type: String },
  
  // Seller-specific fields
  shopName: { type: String },
  businessCategory: { type: String },
  businessDescription: { type: String },
  panCard: { type: String },
  aadhaar: { type: String },
  gstNumber: { type: String },
  
  // Pickup Address
  pickupSameAsBusiness: { type: String, default: 'yes' },
  pickupAddressLine: { type: String },
  pickupCity: { type: String },
  pickupState: { type: String },
  pickupPincode: { type: String },
  pickupContactNumber: { type: String },
  
  // Return Address
  returnAddressLine: { type: String },
  returnCity: { type: String },
  returnState: { type: String },
  returnPincode: { type: String },
  
  // Shipping
  shippingMethod: { type: String, default: 'self' },
  
  // Bank Details
  accountHolderName: { type: String },
  accountNumber: { type: String },
  ifscCode: { type: String },
  bankName: { type: String },

  // Login Tracking
  lastLoginAt: { type: Date, default: null },
  lastLoginIp: { type: String, default: '' },
  loginCount: { type: Number, default: 0 },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
