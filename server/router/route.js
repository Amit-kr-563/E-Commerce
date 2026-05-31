const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../schema/user-schema');
const verifyToken = require('../middleware/authMiddleware');

// Document Validation Functions
const validateAadhar = (aadhar) => {
  if (!aadhar) return false;
  const cleaned = aadhar.replace(/\s/g, '');
  return /^\d{12}$/.test(cleaned);
};

const validatePAN = (pan) => {
  if (!pan) return false;
  // PAN Format: ABCDE1234F (5 letters, 4 numbers, 1 letter)
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i.test(pan.trim());
};

const validateGST = (gst) => {
  if (!gst) return true; // GST is optional
  // GST Format: 15 characters
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9]{1}[Z]{1}[0-9A-Z]{1}$/i.test(gst.trim());
};

const getClientIp = (req) => {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    return String(forwarded).split(',')[0].trim();
  }
  return req.socket?.remoteAddress || '';
};

// Register User
router.post('/register', async (req, res) => {
  const {
    name, mobile, email, addressLine, city, state, pincode, dob, gender, password, role,
    // Seller-specific fields
    shopName, businessCategory, businessDescription, panCard, aadhaar, gstNumber,
    pickupSameAsBusiness, pickupAddressLine, pickupCity, pickupState, pickupPincode, pickupContactNumber,
    returnAddressLine, returnCity, returnState, returnPincode,
    shippingMethod,
    accountHolderName, accountNumber, ifscCode, bankName
  } = req.body;
  
  try {
    // Server-side validations
    const mobileRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    if (!mobile || !mobileRegex.test(mobile)) {
      return res.status(400).json({ message: 'Mobile number must be exactly 10 digits.' });
    }

    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    if (!password || !passwordRegex.test(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters and include an uppercase letter, a number, and a special character.' });
    }

    // Seller-specific document validations
    if (role === 'seller') {
        if (!aadhaar || !validateAadhar(aadhaar)) {
        return res.status(400).json({ message: 'Invalid Aadhar number. Must be 12 digits.' });
      }

      if (!panCard || !validatePAN(panCard)) {
        return res.status(400).json({ message: 'Invalid PAN number. Format must be like ABCDE1234F (5 letters, 4 numbers, 1 letter)' });
      }

      if (gstNumber && !validateGST(gstNumber)) {
        return res.status(400).json({ message: 'Invalid GST number. Format must be 15 characters.' });
      }
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }]
    });
    
    if (existingUser) {
      return res.status(400).json({ message: "User already exists with this email or mobile" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user object with all fields
    const userData = { 
      name,
      mobile,
      email,
      addressLine,
      city,
      state,
      pincode,
      dob,
      gender,
      password: hashedPassword,
      role: role || 'user'
    };

    // Add seller-specific fields if role is seller
    if (role === 'seller') {
      if (shopName) userData.shopName = shopName;
      if (businessCategory) userData.businessCategory = businessCategory;
      if (businessDescription) userData.businessDescription = businessDescription;
      if (panCard) userData.panCard = panCard;
      if (aadhaar) userData.aadhaar = aadhaar;
      if (gstNumber) userData.gstNumber = gstNumber;
      if (pickupSameAsBusiness) userData.pickupSameAsBusiness = pickupSameAsBusiness;
      if (pickupAddressLine) userData.pickupAddressLine = pickupAddressLine;
      if (pickupCity) userData.pickupCity = pickupCity;
      if (pickupState) userData.pickupState = pickupState;
      if (pickupPincode) userData.pickupPincode = pickupPincode;
      if (pickupContactNumber) userData.pickupContactNumber = pickupContactNumber;
      if (returnAddressLine) userData.returnAddressLine = returnAddressLine;
      if (returnCity) userData.returnCity = returnCity;
      if (returnState) userData.returnState = returnState;
      if (returnPincode) userData.returnPincode = returnPincode;
      if (shippingMethod) userData.shippingMethod = shippingMethod;
      if (accountHolderName) userData.accountHolderName = accountHolderName;
      if (accountNumber) userData.accountNumber = accountNumber;
      if (ifscCode) userData.ifscCode = ifscCode;
      if (bankName) userData.bankName = bankName;
    }

    const user = new User(userData);
    await user.save();
    
    res.status(201).json({ 
      message: role === 'seller' ? "Seller Registered Successfully" : "User Registered Successfully" 
    });
  } catch (error) {
    console.log("Register Error:", error);
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
});

// Register Seller
router.post('/seller/register', async (req, res) => {
  const {name,mobile,email,addressLine,city,state,pincode,password} = req.body;
  try {
    // Server-side validations for seller
    const mobileRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    if (!mobile || !mobileRegex.test(mobile)) {
      return res.status(400).json({ message: 'Mobile number must be exactly 10 digits.' });
    }

    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    if (!password || !passwordRegex.test(password)) {
      return res.status(400).json({ message: 'Password must be at least 8 characters and include an uppercase letter, a number, and a special character.' });
    }
    // Check if seller already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }]
    });
    
    if (existingUser) {
      return res.status(400).json({ message: "Seller already exists with this email or mobile" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const seller = new User({ 
      name,
      mobile,
      email,
      addressLine,
      city,
      state,
      pincode,
      password: hashedPassword,
      role: 'seller'
    });
    await seller.save();
    
    res.status(201).json({ message: "Seller Registered Successfully" });
  } catch (error) {
    console.log("Seller Register Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});


router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ email: username }, { mobile: username }]
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    
    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Wrong password" });

    user.lastLoginAt = new Date();
    user.lastLoginIp = getClientIp(req);
    user.loginCount = (user.loginCount || 0) + 1;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password before sending to frontend
    const { password: pwd, ...safeUser } = user._doc;

    const message = user.role === 'seller' ? 'Seller login successful' : 'Login successful';

    res.status(200).json({ 
      message: message, 
      token,
      user: safeUser 
    });
  } catch (error) {
    console.log("Login Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Seller Login
router.post('/seller/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const seller = await User.findOne({
      $or: [{ email: username }, { mobile: username }],
      role: 'seller'
    });

    if (!seller) return res.status(404).json({ message: "Seller not found" });
    
    // Compare hashed password
    const isPasswordValid = await bcrypt.compare(password, seller.password);
    if (!isPasswordValid) return res.status(401).json({ message: "Wrong password" });

    seller.lastLoginAt = new Date();
    seller.lastLoginIp = getClientIp(req);
    seller.loginCount = (seller.loginCount || 0) + 1;
    await seller.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: seller._id, email: seller.email, role: seller.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Remove password before sending to frontend
    const { password: pwd, ...safeSeller } = seller._doc;

    res.status(200).json({ 
      message: "Seller login successful", 
      token,
      user: safeSeller 
    });
  } catch (error) {
    console.log("Seller Login Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});


// User Info for About Page
// router.post('/userinfo', async (req, res) => {
//   const { username } = req.body;
//   try {
//     const user = await User.findOne({
//       $or: [{ email: username }, { mobile: username }]
//     });

//     if (!user) return res.status(404).json("User not found");

//     res.status(200).json({
//       name: user.name,
//       email: user.email,
//       mobile: user.mobile
//     });
//   } catch (error) {
//     console.log("UserInfo Error:", error);
//     res.status(500).json("Something went wrong");
//   }
// });
// Get user info - Protected route with JWT
router.get('/userinfo', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');

    if (!user) return res.status(404).json({ message: "User not found" });

    // Return all user data (password already excluded)
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
      gender: user.gender,
      dob: user.dob,
      addressLine: user.addressLine,
      city: user.city,
      state: user.state,
      pincode: user.pincode
    };

    // Add seller-specific fields if user is a seller
    if (user.role === 'seller') {
      userData.shopName = user.shopName;
      userData.businessCategory = user.businessCategory;
      userData.businessDescription = user.businessDescription;
      userData.panCard = user.panCard;
      userData.aadhaar = user.aadhaar;
      userData.gstNumber = user.gstNumber;
      userData.pickupSameAsBusiness = user.pickupSameAsBusiness;
      userData.pickupAddressLine = user.pickupAddressLine;
      userData.pickupCity = user.pickupCity;
      userData.pickupState = user.pickupState;
      userData.pickupPincode = user.pickupPincode;
      userData.pickupContactNumber = user.pickupContactNumber;
      userData.returnAddressLine = user.returnAddressLine;
      userData.returnCity = user.returnCity;
      userData.returnState = user.returnState;
      userData.returnPincode = user.returnPincode;
      userData.shippingMethod = user.shippingMethod;
      userData.accountHolderName = user.accountHolderName;
      userData.accountNumber = user.accountNumber;
      userData.ifscCode = user.ifscCode;
      userData.bankName = user.bankName;
    }

    res.status(200).json(userData);
  } catch (error) {
    console.error("UserInfo error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

// Admin - Get all user/seller login details
router.get('/admin/accounts', async (req, res) => {
  try {
    const users = await User.find({}, '-password').sort({ createdAt: -1 });

    const enriched = users.map((user) => {
      const item = user.toObject();

      if (item.role === 'seller') {
        const hasPan = Boolean(item.panCard);
        const hasAadhaar = Boolean(item.aadhaar);
        const hasRequiredDocs = hasPan && hasAadhaar;
        const validPan = hasPan ? validatePAN(item.panCard) : false;
        const validAadhaar = hasAadhaar ? validateAadhar(item.aadhaar) : false;
        const validGst = item.gstNumber ? validateGST(item.gstNumber) : true;

        item.documentStatus =
          hasRequiredDocs && validPan && validAadhaar && validGst ? 'verified' : 'suspicious';
      }

      return item;
    });

    res.status(200).json(enriched);
  } catch (error) {
    console.error('Admin accounts fetch error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Admin - Remove user/seller account
router.delete('/admin/accounts/:id', async (req, res) => {
  try {
    const account = await User.findById(req.params.id);

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: `${account.role} account removed successfully` });
  } catch (error) {
    console.error('Admin delete account error:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});



module.exports = router;
