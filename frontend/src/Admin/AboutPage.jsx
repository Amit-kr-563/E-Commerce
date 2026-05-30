import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    Paper,
    Typography
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserInfo } from '../service/api';

const AboutPage = ({ username }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loggedInUser = username ||
    JSON.parse(localStorage.getItem("loggedInUser"))?.user?.username ||
    JSON.parse(localStorage.getItem("loggedInUser"))?.user?.email ||
    JSON.parse(localStorage.getItem("loggedInUser"))?.user?.mobile;

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await getUserInfo();
        setUser(res.data);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError("Session expired. Please login again.");
          setTimeout(() => {
            localStorage.removeItem("loggedInUser");
            navigate("/login");
          }, 2000);
        } else {
          setError("Failed to load user info");
        }
        console.error(err);
      }
    };
    if (loggedInUser) fetchUserInfo();
  }, [loggedInUser, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      {error && <Alert severity="error">{error}</Alert>}
      {!user && !error && (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      )}
      {user && (
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom sx={{ color: '#000', borderBottom: '3px solid #ffe680', pb: 1 }}>
            {user.role === 'seller' ? '🏪 ' : '👤 '}Welcome, {user.name}
          </Typography>

          {/* Personal Information */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ color: '#000', fontWeight: 600, mb: 2, borderBottom: '2px solid #ffe680', pb: 1 }}>
              📋 Personal Information
            </Typography>
            <Typography variant="body1" gutterBottom><strong>Name:</strong> {user.name}</Typography>
            <Typography variant="body1" gutterBottom><strong>Email:</strong> {user.email}</Typography>
            <Typography variant="body1" gutterBottom><strong>Mobile:</strong> {user.mobile}</Typography>
            <Typography variant="body1" gutterBottom><strong>Role:</strong> {user.role === 'seller' ? 'Seller' : 'Customer'}</Typography>
            {user.gender && <Typography variant="body1" gutterBottom><strong>Gender:</strong> {user.gender}</Typography>}
            {user.dob && <Typography variant="body1" gutterBottom><strong>Date of Birth:</strong> {user.dob}</Typography>}
          </Box>

          {/* Seller-specific Information */}
          {user.role === 'seller' && (
            <>
              {/* Business Information */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ color: '#000', fontWeight: 600, mb: 2, borderBottom: '2px solid #ffe680', pb: 1 }}>
                  🏢 Business Information
                </Typography>
                {user.shopName && <Typography variant="body1" gutterBottom><strong>Shop/Brand Name:</strong> {user.shopName}</Typography>}
                {user.businessCategory && <Typography variant="body1" gutterBottom><strong>Business Category:</strong> {user.businessCategory}</Typography>}
                {user.businessDescription && <Typography variant="body1" gutterBottom><strong>Description:</strong> {user.businessDescription}</Typography>}
              </Box>

              {/* Legal Documents */}
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ color: '#000', fontWeight: 600, mb: 2, borderBottom: '2px solid #ffe680', pb: 1 }}>
                  📄 Legal Documents
                </Typography>
                {user.panCard && <Typography variant="body1" gutterBottom><strong>PAN Card:</strong> {user.panCard}</Typography>}
                {user.aadhaar && <Typography variant="body1" gutterBottom><strong>Aadhaar:</strong> {user.aadhaar}</Typography>}
                {user.gstNumber && <Typography variant="body1" gutterBottom><strong>GST Number:</strong> {user.gstNumber}</Typography>}
              </Box>
            </>
          )}

          {/* Address Information */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ color: '#000', fontWeight: 600, mb: 2, borderBottom: '2px solid #ffe680', pb: 1 }}>
              📍 {user.role === 'seller' ? 'Business' : ''} Address
            </Typography>
            {user.addressLine && <Typography variant="body1" gutterBottom><strong>Address:</strong> {user.addressLine}</Typography>}
            {user.city && <Typography variant="body1" gutterBottom><strong>City:</strong> {user.city}</Typography>}
            {user.state && <Typography variant="body1" gutterBottom><strong>State:</strong> {user.state}</Typography>}
            {user.pincode && <Typography variant="body1" gutterBottom><strong>Pincode:</strong> {user.pincode}</Typography>}
          </Box>

          {/* Pickup Address - Seller only */}
          {user.role === 'seller' && user.pickupAddressLine && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ color: '#000', fontWeight: 600, mb: 2, borderBottom: '2px solid #ffe680', pb: 1 }}>
                📦 Pickup Address
              </Typography>
              <Typography variant="body1" gutterBottom><strong>Address:</strong> {user.pickupAddressLine}</Typography>
              <Typography variant="body1" gutterBottom><strong>City:</strong> {user.pickupCity}</Typography>
              <Typography variant="body1" gutterBottom><strong>State:</strong> {user.pickupState}</Typography>
              <Typography variant="body1" gutterBottom><strong>Pincode:</strong> {user.pickupPincode}</Typography>
              {user.pickupContactNumber && <Typography variant="body1" gutterBottom><strong>Contact:</strong> {user.pickupContactNumber}</Typography>}
            </Box>
          )}

          {/* Return Address - Seller only */}
          {user.role === 'seller' && user.returnAddressLine && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ color: '#000', fontWeight: 600, mb: 2, borderBottom: '2px solid #ffe680', pb: 1 }}>
                🔄 Return Address
              </Typography>
              <Typography variant="body1" gutterBottom><strong>Address:</strong> {user.returnAddressLine}</Typography>
              <Typography variant="body1" gutterBottom><strong>City:</strong> {user.returnCity}</Typography>
              <Typography variant="body1" gutterBottom><strong>State:</strong> {user.returnState}</Typography>
              <Typography variant="body1" gutterBottom><strong>Pincode:</strong> {user.returnPincode}</Typography>
            </Box>
          )}

          {/* Bank Details - Seller only */}
          {user.role === 'seller' && user.accountNumber && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ color: '#000', fontWeight: 600, mb: 2, borderBottom: '2px solid #ffe680', pb: 1 }}>
                🏦 Bank Details
              </Typography>
              <Typography variant="body1" gutterBottom><strong>Account Holder:</strong> {user.accountHolderName}</Typography>
              <Typography variant="body1" gutterBottom><strong>Account Number:</strong> {user.accountNumber}</Typography>
              <Typography variant="body1" gutterBottom><strong>IFSC Code:</strong> {user.ifscCode}</Typography>
              <Typography variant="body1" gutterBottom><strong>Bank Name:</strong> {user.bankName}</Typography>
            </Box>
          )}

          {/* Logout Button */}
          <Box mt={3} textAlign="center">
            <Button variant="outlined" color="error" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        </Paper>
      )}
    </Container>
  );
};

export default AboutPage;
