const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  mobile: { type: String },
  password: { type: String },
  role: { 
    type: String, 
    enum: ['user', 'seller'], 
    default: 'user' 
  },
  
  addressLine: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  
  dob: { type: String },
  gender: { type: String },
  
  shopName: { type: String },
  businessCategory: { type: String },
  businessDescription: { type: String },
  panCard: { type: String },
  aadhaar: { type: String },
  gstNumber: { type: String },
  
  pickupSameAsBusiness: { type: String, default: 'yes' },
  pickupAddressLine: { type: String },
  pickupCity: { type: String },
  pickupState: { type: String },
  pickupPincode: { type: String },
  pickupContactNumber: { type: String },
  
  returnAddressLine: { type: String },
  returnCity: { type: String },
  returnState: { type: String },
  returnPincode: { type: String },
  
  shippingMethod: { type: String, default: 'self' },
  
  accountHolderName: { type: String },
  accountNumber: { type: String },
  ifscCode: { type: String },
  bankName: { type: String },

  lastLoginAt: { type: Date, default: null },
  lastLoginIp: { type: String, default: '' },
  loginCount: { type: Number, default: 0 },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
