
import {
    Avatar,
    Box,
    Button,
    Divider,
    FormControlLabel,
    Paper,
    Radio,
    RadioGroup,
    TextField,
    Typography
} from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ProceedToPayPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { cartItems, totalAmount, user } = location.state || {};

  const [customAddress, setCustomAddress] = useState("");
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [addressChoice, setAddressChoice] = useState("registered");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const handleSaveAddress = () => {
    const trimmed = customAddress.trim();
    if (trimmed && !savedAddresses.includes(trimmed)) {
      setSavedAddresses([...savedAddresses, trimmed]);
      setSelectedAddress(trimmed);
      setCustomAddress("");
    }
  };

  const getFinalAddress = () => {
    if (addressChoice === "registered") {
      return `${user?.addressLine}, ${user?.city}, ${user?.state} - ${user?.pincode}`;
    } else {
      return selectedAddress;
    }
  };

  const handlePlaceOrder = async () => {
    const finalAddress = getFinalAddress();

    if (!finalAddress) {
      Swal.fire({
        toast: true,
        position: "top",
        icon: "warning",
        title: "Please select or enter an address.",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    // Enhance cart items with productId and sellerId
    const enhancedCartItems = cartItems.map(item => ({
      productId: item._id,
      sellerId: item.sellerId,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      img: item.img,
      status: 'Ordered'
    }));

    const orderData = {
      userId: user?._id,
      username: user?.email || user?.mobile,
      fullName: user?.fullName || user?.name,
      email: user?.email,
      mobile: user?.mobile,
      address: finalAddress,
      paymentMethod,
      bank: "",
      cartItems: enhancedCartItems,
      totalAmount,
    };

    if (paymentMethod === "upi") {
      navigate("/payment", {
        state: {
          user,
          totalAmount,
          address: finalAddress,
          cartItems,
        },
      });
    } else {
      try {
        await axios.post("http://localhost:8000/order", orderData);
        Swal.fire({
          toast: true,
          position: "top",
          icon: "success",
          title: "Order placed successfully!",
          showConfirmButton: false,
          timer: 2000,
        });
        navigate("/");
      } catch (err) {
        console.error("Error placing order:", err);
        Swal.fire({
          toast: true,
          position: "top",
          icon: "error",
          title: "Failed to place order!",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    }
  };

  return (
    <Box className="checkout-wrapper" display="flex" justifyContent="center" mt={5}>
      <Paper elevation={4} sx={{ padding: 5, width: "100%", maxWidth: 900, borderRadius: 3 }}>
        <Typography variant="h4" gutterBottom fontWeight={600} textAlign="center">
          Checkout & Payment
        </Typography>

        {/* User Info */}
        <Box my={3}>
          <Typography variant="subtitle1" fontWeight={500}>
            Customer Info
          </Typography>
          <Typography>Name: {user?.name}</Typography>
          <Typography>Email: {user?.email}</Typography>
          <Typography>Mobile: {user?.mobile}</Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Address */}
        <Box>
          <Typography variant="subtitle1" fontWeight={500}>
            Delivery Address
          </Typography>
          <FormControlLabel
            control={<Radio checked={addressChoice === "registered"} onChange={() => setAddressChoice("registered")} />}
            label={`Registered Address: ${user?.addressLine}, ${user?.city}, ${user?.state} - ${user?.pincode}`}
          />

          <FormControlLabel
            control={<Radio checked={addressChoice === "custom"} onChange={() => setAddressChoice("custom")} />}
            label="Use Custom Address"
          />

          {addressChoice === "custom" && (
            <Box>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={customAddress}
                onChange={(e) => setCustomAddress(e.target.value)}
                placeholder="Enter custom address"
                sx={{ mt: 2 }}
              />
              <Button variant="outlined" onClick={handleSaveAddress} sx={{ mt: 1 }}>
                Save Address
              </Button>

              {savedAddresses.length > 0 && (
                <Box mt={2}>
                  <Typography>Select from saved:</Typography>
                  {savedAddresses.map((addr, i) => (
                    <Box key={i} display="flex" alignItems="center" mt={1}>
                      <Radio checked={selectedAddress === addr} onChange={() => setSelectedAddress(addr)} />
                      <Typography>{addr}</Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
          )}

          <Typography sx={{ mt: 2, fontStyle: "italic" }}>
            Selected Address: {getFinalAddress() || "None"}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Cart Items */}
        <Box>
          <Typography variant="subtitle1" fontWeight={500}>
            Items in Your Cart
          </Typography>
          {cartItems?.map((item) => (
            <Box key={item._id} display="flex" alignItems="center" mt={2} gap={2}>
              <Avatar src={item.img} variant="square" sx={{ width: 70, height: 70, borderRadius: 2 }} />
              <Box>
                <Typography fontWeight={500}>{item.name}</Typography>
                <Typography variant="body2">
                  ₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>

        <Typography variant="h6" align="right" mt={3}>
          Total Amount: ₹{totalAmount}
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* Payment Section */}
        <Box>
          <Typography variant="subtitle1" fontWeight={500}>
            Select Payment Method
          </Typography>
          <RadioGroup row value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <FormControlLabel value="cod" control={<Radio />} label="Cash on Delivery" />
            <FormControlLabel value="upi" control={<Radio />} label="UPI" />
          </RadioGroup>

          {paymentMethod === "upi" && (
            <Typography variant="body2" sx={{ mt: 1, color: "gray" }}>
              You will be redirected to the UPI payment page.
            </Typography>
          )}
        </Box>

        {/* Place Order Button */}
        <Box display="flex" justifyContent="flex-end" mt={4}>
          <Button
            variant="contained"
            color="success"
            size="large"
            onClick={handlePlaceOrder}
            disabled={
              (addressChoice === "custom" && !selectedAddress) ||
              (addressChoice === "registered" &&
                (!user?.addressLine || !user?.city || !user?.state || !user?.pincode))
            }
            sx={{ fontWeight: 600, px: 4 }}
          >
            {paymentMethod === "cod" ? "Place Order" : "Pay Now"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ProceedToPayPage;
