import { Box, Button, FormControl, FormControlLabel, FormLabel, MenuItem, Paper, Radio, RadioGroup, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { addUser } from '../service/api';

function SellerRegister() {
  const [formData, setFormData] = useState({
    name: '',
    shopName: '',
    businessCategory: '',
    businessDescription: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
    panCard: '',
    aadhaar: '',
    gstNumber: '',
    pickupSameAsBusiness: 'yes',
    pickupAddressLine: '',
    pickupCity: '',
    pickupState: '',
    pickupPincode: '',
    pickupContactNumber: '',
    returnAddressLine: '',
    returnCity: '',
    returnState: '',
    returnPincode: '',
    shippingMethod: 'self',
    role: 'seller'
  });

  const [validationStatus, setValidationStatus] = useState({
    aadhaar: null,
    panCard: null,
    gstNumber: null
  });

  const navigate = useNavigate();

  // Validation functions for legal documents
  const validateAadhar = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const aadharRegex = /^\d{12}$/;
    if (!value.trim()) return null;
    const isValid = aadharRegex.test(cleaned);
    return isValid;
  };

  const validatePAN = (value) => {
    // PAN Format: ABCDE1234F (5 letters, 4 numbers, 1 letter)
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!value.trim()) return null;
    return panRegex.test(value.toUpperCase());
  };

  const validateGST = (value) => {
    // GST Format: 15 characters - AABBB9999AAAA or similar
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9]{1}[Z]{1}[0-9A-Z]{1}$/;
    if (!value.trim()) return null;
    return gstRegex.test(value.toUpperCase());
  };

  const businessCategories = [
    'Fashion & Apparel',
    'Electronics',
    'Home & Living',
    'Grocery & Daily Needs',
    'Beauty & Personal Care',
    'Books & Stationery',
    'Toys, Kids & Baby',
    'Sports & Fitness',
    'Automobile Accessories',
    'Gaming & Entertainment',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Real-time validation for documents
    if (name === 'aadhaar') {
      setValidationStatus(prev => ({
        ...prev,
        aadhaar: validateAadhar(value)
      }));
    } else if (name === 'panCard') {
      setValidationStatus(prev => ({
        ...prev,
        panCard: validatePAN(value)
      }));
    } else if (name === 'gstNumber') {
      setValidationStatus(prev => ({
        ...prev,
        gstNumber: validateGST(value)
      }));
    }

    // Auto-fill pickup address if same as business
    if (name === 'pickupSameAsBusiness' && value === 'yes') {
      setFormData(prev => ({
        ...prev,
        pickupAddressLine: prev.addressLine,
        pickupCity: prev.city,
        pickupState: prev.state,
        pickupPincode: prev.pincode,
        pickupContactNumber: prev.mobile
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Client-side validations
    const mobileRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    if (!mobileRegex.test(formData.mobile)) {
      return Swal.fire("Invalid Mobile", "Mobile number must be exactly 10 digits.", "error");
    }

    if (!emailRegex.test(formData.email)) {
      return Swal.fire("Invalid Email", "Please enter a valid email address.", "error");
    }

    if (!passwordRegex.test(formData.password)) {
      return Swal.fire("Weak Password", "Password must be at least 8 characters and include an uppercase letter, a number, and a special character.", "error");
    }

    if (formData.password !== formData.confirmPassword) {
      return Swal.fire("Error", "Passwords do not match", "error");
    }

    // Validate legal documents
    if (!validateAadhar(formData.aadhaar)) {
      return Swal.fire("Invalid Aadhar", "Aadhar must be 12 digits (format: 1234 5678 9012 or 123456789012)", "error");
    }

    if (!validatePAN(formData.panCard)) {
      return Swal.fire("Invalid PAN", "PAN must be 10 characters in format ABCDE1234F", "error");
    }

    if (formData.gstNumber && !validateGST(formData.gstNumber)) {
      return Swal.fire("Invalid GST", "GST must be 15 characters. Example: 22AAAAA0000A1Z5", "error");
    }
    
    try {
      const response = await addUser(formData);
      if (response.status === 201) {
        Swal.fire("Success", response.data.message || "Seller Registered Successfully", "success");
        navigate('/login');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Registration failed';
      Swal.fire("Error", errorMsg, "error");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 6 }}>
      <Paper elevation={3} sx={{ p: 4, width: "100%", maxWidth: 800, border: '2px solid #ffe680' }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
          Seller Registration 🏪
        </Typography>
        <Typography variant="body2" align="center" sx={{ mb: 3, color: '#666' }}>
          Complete all details to start selling your products
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <Typography variant="h6" sx={{ mt: 2, mb: 2, fontWeight: 600, color: '#000', borderBottom: '2px solid #ffe680', pb: 1 }}>
            📋 Personal Information
          </Typography>
          
          <TextField
            label="Full Name *"
            name="name"
            fullWidth
            sx={{ mt: 1 }}
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            label="Email *"
            name="email"
            type="email"
            fullWidth
            sx={{ mt: 1 }}
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            label="Mobile Number *"
            name="mobile"
            fullWidth
            sx={{ mt: 1 }}
            value={formData.mobile}
            onChange={handleChange}
            required
          />

          {/* Business Information */}
          <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600, color: '#000', borderBottom: '2px solid #ffe680', pb: 1 }}>
            🏢 Business Information
          </Typography>

          <TextField
            label="Shop / Brand Name *"
            name="shopName"
            fullWidth
            sx={{ mt: 1 }}
            value={formData.shopName}
            onChange={handleChange}
            required
          />

          <TextField
            select
            label="Business Category *"
            name="businessCategory"
            fullWidth
            sx={{ mt: 1 }}
            value={formData.businessCategory}
            onChange={handleChange}
            required
          >
            {businessCategories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Business Description *"
            name="businessDescription"
            fullWidth
            multiline
            rows={3}
            sx={{ mt: 1 }}
            value={formData.businessDescription}
            onChange={handleChange}
            placeholder="Tell us about your business, products, and services..."
            required
          />

          {/* Business Address */}
          <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600, color: '#000', borderBottom: '2px solid #ffe680', pb: 1 }}>
            📍 Business Address
          </Typography>

          <TextField
            label="Address Line *"
            name="addressLine"
            fullWidth
            sx={{ mt: 1 }}
            value={formData.addressLine}
            onChange={handleChange}
            required
          />

          <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
            <TextField
              label="City *"
              name="city"
              fullWidth
              value={formData.city}
              onChange={handleChange}
              required
            />
            <TextField
              label="State *"
              name="state"
              fullWidth
              value={formData.state}
              onChange={handleChange}
              required
            />
            <TextField
              label="Pincode *"
              name="pincode"
              fullWidth
              value={formData.pincode}
              onChange={handleChange}
              required
            />
          </Box>

          {/* Legal Documents */}
          <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600, color: '#000', borderBottom: '2px solid #ffe680', pb: 1 }}>
            📄 Legal Documents - Verification Required
          </Typography>

          <Box sx={{ mb: 2, p: 2, backgroundColor: '#fff8e1', borderRadius: 1, border: '1px solid #ffe680' }}>
            <Typography variant="body2" sx={{ color: '#666', fontSize: '12px' }}>
              ⚠️ Valid legal documents are required. Providing fake information may result in account suspension.
            </Typography>
          </Box>

          {/* PAN Card */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                label="PAN Card Number *"
                name="panCard"
                fullWidth
                sx={{ mt: 1 }}
                value={formData.panCard}
                onChange={handleChange}
                placeholder="ABCDE1234F"
                required
                error={validationStatus.panCard === false}
              />
              {validationStatus.panCard === true && (
                <span style={{ color: '#2ecc71', fontSize: '20px', marginTop: '8px' }}>✓</span>
              )}
              {validationStatus.panCard === false && (
                <span style={{ color: '#e74c3c', fontSize: '20px', marginTop: '8px' }}>✗</span>
              )}
            </Box>
            {validationStatus.panCard === false && (
              <Typography variant="caption" sx={{ color: '#e74c3c', display: 'block', mt: 0.5 }}>
                Invalid PAN format. Use format: ABCDE1234F (5 letters, 4 numbers, 1 letter)
              </Typography>
            )}
          </Box>

          {/* Aadhaar */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                label="Aadhaar / Govt ID Number *"
                name="aadhaar"
                fullWidth
                sx={{ mt: 1 }}
                value={formData.aadhaar}
                onChange={handleChange}
                placeholder="1234 5678 9012"
                required
                error={validationStatus.aadhaar === false}
              />
              {validationStatus.aadhaar === true && (
                <span style={{ color: '#2ecc71', fontSize: '20px', marginTop: '8px' }}>✓</span>
              )}
              {validationStatus.aadhaar === false && (
                <span style={{ color: '#e74c3c', fontSize: '20px', marginTop: '8px' }}>✗</span>
              )}
            </Box>
            {validationStatus.aadhaar === false && (
              <Typography variant="caption" sx={{ color: '#e74c3c', display: 'block', mt: 0.5 }}>
                Invalid Aadhar format. Must be 12 digits (with or without spaces)
              </Typography>
            )}
          </Box>

          {/* GST Number */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                label="GST Number (Optional)"
                name="gstNumber"
                fullWidth
                sx={{ mt: 1 }}
                value={formData.gstNumber}
                onChange={handleChange}
                placeholder="22AAAAA0000A1Z5"
                error={validationStatus.gstNumber === false}
              />
              {validationStatus.gstNumber === true && (
                <span style={{ color: '#2ecc71', fontSize: '20px', marginTop: '8px' }}>✓</span>
              )}
              {validationStatus.gstNumber === false && (
                <span style={{ color: '#e74c3c', fontSize: '20px', marginTop: '8px' }}>✗</span>
              )}
            </Box>
            {validationStatus.gstNumber === false && (
              <Typography variant="caption" sx={{ color: '#e74c3c', display: 'block', mt: 0.5 }}>
                Invalid GST format. Use format: 22AAAAA0000A1Z5 (15 characters)
              </Typography>
            )}
          </Box>

          {/* Pickup Address */}
          <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600, color: '#000', borderBottom: '2px solid #ffe680', pb: 1 }}>
            📦 Pickup Address
          </Typography>

          <FormControl component="fieldset" sx={{ mt: 1 }}>
            <FormLabel component="legend">Pickup Address Same as Business?</FormLabel>
            <RadioGroup
              row
              name="pickupSameAsBusiness"
              value={formData.pickupSameAsBusiness}
              onChange={handleChange}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </FormControl>

          {formData.pickupSameAsBusiness === 'no' && (
            <>
              <TextField
                label="Pickup Address Line *"
                name="pickupAddressLine"
                fullWidth
                sx={{ mt: 1 }}
                value={formData.pickupAddressLine}
                onChange={handleChange}
                required
              />
              <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                <TextField
                  label="City *"
                  name="pickupCity"
                  fullWidth
                  value={formData.pickupCity}
                  onChange={handleChange}
                  required
                />
                <TextField
                  label="State *"
                  name="pickupState"
                  fullWidth
                  value={formData.pickupState}
                  onChange={handleChange}
                  required
                />
                <TextField
                  label="Pincode *"
                  name="pickupPincode"
                  fullWidth
                  value={formData.pickupPincode}
                  onChange={handleChange}
                  required
                />
              </Box>
            </>
          )}

          <TextField
            label="Pickup Contact Number *"
            name="pickupContactNumber"
            fullWidth
            sx={{ mt: 1 }}
            value={formData.pickupContactNumber}
            onChange={handleChange}
            required
          />

          {/* Return Address */}
          <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600, color: '#000', borderBottom: '2px solid #ffe680', pb: 1 }}>
            🔄 Return Address
          </Typography>

          <TextField
            label="Return Address Line *"
            name="returnAddressLine"
            fullWidth
            sx={{ mt: 1 }}
            value={formData.returnAddressLine}
            onChange={handleChange}
            required
          />
          <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
            <TextField
              label="City *"
              name="returnCity"
              fullWidth
              value={formData.returnCity}
              onChange={handleChange}
              required
            />
            <TextField
              label="State *"
              name="returnState"
              fullWidth
              value={formData.returnState}
              onChange={handleChange}
              required
            />
            <TextField
              label="Pincode *"
              name="returnPincode"
              fullWidth
              value={formData.returnPincode}
              onChange={handleChange}
              required
            />
          </Box>

          {/* Shipping Method */}
          <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600, color: '#000', borderBottom: '2px solid #ffe680', pb: 1 }}>
            🚚 Shipping Method
          </Typography>

          <FormControl component="fieldset" sx={{ mt: 1 }}>
            <RadioGroup
              name="shippingMethod"
              value={formData.shippingMethod}
              onChange={handleChange}
            >
              <FormControlLabel 
                value="self" 
                control={<Radio />} 
                label="Self Shipping - I will handle shipping myself" 
              />
              <FormControlLabel 
                value="platform" 
                control={<Radio />} 
                label="Platform Shipping - Use platform's shipping partners" 
              />
            </RadioGroup>
          </FormControl>

          {/* Password */}
          <Typography variant="h6" sx={{ mt: 3, mb: 2, fontWeight: 600, color: '#000', borderBottom: '2px solid #ffe680', pb: 1 }}>
            🔒 Security
          </Typography>

          <TextField
            type="password"
            label="Password *"
            name="password"
            fullWidth
            sx={{ mt: 1 }}
            value={formData.password}
            onChange={handleChange}
            required
          />
          <TextField
            type="password"
            label="Confirm Password *"
            name="confirmPassword"
            fullWidth
            sx={{ mt: 1 }}
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />

          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{ 
              mt: 2,
              backgroundColor: '#ffe680',
              color: '#000',
              border: '2px solid #000',
              '&:hover': {
                backgroundColor: '#fff',
                borderColor: '#ffe680'
              }
            }}
          >
            Register as Seller
          </Button>
        </form>

        <Typography sx={{ mt: 2 }} align="center">
          Already have an account?{" "}
          <a href="/login" style={{ color: "#000", fontWeight: 'bold', textDecoration: "none" }}>
            Login
          </a>
        </Typography>
      </Paper>
    </Box>
  );
}

export default SellerRegister;
