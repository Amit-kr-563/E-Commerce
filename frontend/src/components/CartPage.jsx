


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Divider,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
  Chip
} from "@mui/material";
 import Swal from "sweetalert2";
import { Delete, Add, Remove } from "@mui/icons-material";

const CartPage = ({username}) => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const user = username||JSON.parse(localStorage.getItem("loggedInUser"))?.user;

  useEffect(() => {
  

    if (!user) {
      Swal.fire({
        toast: true,
        position: 'top',
        icon: 'warning',
        title: 'Please login first',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
      navigate("/login");
      return;
    }

    const fetchCart = async () => {
      const username = user.email || user.mobile;
      try {
        const res = await axios.get(`http://localhost:8000/cart/${username}`);
        console.log("Cart items fetched:", res.data);
        setCartItems(res.data);
      } catch (err) {
        console.error("Error fetching cart:", err);
      }
    };

    fetchCart();
  }, [user, navigate]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/cart/${id}`);
      setCartItems(cartItems.filter((item) => item._id !== id));
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  const handleQuantityChange = async (id, newQty) => {
    if (newQty < 1) return;
    try {
      const res = await axios.put(`http://localhost:8000/cart/${id}`, {
        quantity: newQty,
      });
      
      // Update the entire item with new data from server including price, discount, etc.
      setCartItems(
        cartItems.map((item) =>
          item._id === id ? { 
            ...item, 
            quantity: res.data.quantity,
            price: res.data.price,
            bulkDiscount: res.data.bulkDiscount,
            originalPrice: res.data.originalPrice
          } : item
        )
      );

      window.dispatchEvent(new Event("cart-updated"));
      
      console.log("Updated item:", res.data);
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  const getTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);
  };

  const formatCurrency = (value) => `₹${Number(value || 0).toFixed(2)}`;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #fffdf3 0%, #fff8d8 42%, #fff 100%)",
        py: 4,
        px: { xs: 1.5, md: 3 },
      }}
    >
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            border: "2px solid #ffe680",
            borderRadius: 3,
            mb: 2,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#111" }}>
            Your Cart
          </Typography>
          <Typography variant="body1" sx={{ color: "#666", mt: 0.5 }}>
            {getTotalItems()} items selected for checkout
          </Typography>
        </Paper>

        {cartItems.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 3,
              border: "1px dashed #e2d184",
              background: "#fffef8",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Your cart is empty
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 1, mb: 2 }}>
              Add products to your cart and come back to checkout.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/Shop")}
              sx={{
                backgroundColor: "#111",
                color: "#ffe680",
                textTransform: "none",
                fontWeight: 700,
                '&:hover': { backgroundColor: "#222" },
              }}
            >
              Continue Shopping
            </Button>
          </Paper>
        ) : (
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" }, gap: 2 }}>
            <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #eee", overflow: "hidden" }}>
              <TableContainer>
                <Table>
                  <TableHead sx={{ background: "#fff8d9" }}>
                    <TableRow>
                      <TableCell>Product</TableCell>
                      <TableCell align="center">Price</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      <TableCell align="center">Delete</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartItems.map((item, idx) => (
                      <TableRow key={item._id} sx={{ background: idx % 2 === 0 ? "#fff" : "#fffef5" }}>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={2}>
                            <Avatar
                              src={item.img}
                              alt={item.name}
                              variant="square"
                              sx={{ width: 70, height: 90, borderRadius: 2 }}
                            />
                            <Box>
                              <Typography sx={{ fontWeight: 700 }}>{item.name}</Typography>
                              {item.bulkDiscount > 0 && (
                                <Chip
                                  label={`${item.bulkDiscount}% Bulk Discount`}
                                  color="success"
                                  size="small"
                                  sx={{ mt: 0.5 }}
                                />
                              )}
                            </Box>
                          </Box>
                        </TableCell>

                        <TableCell align="center">
                          <Box>
                            {item.bulkDiscount > 0 ? (
                              <>
                                <Typography
                                  variant="body2"
                                  sx={{ textDecoration: "line-through", color: "text.secondary" }}
                                >
                                  {formatCurrency(item.originalPrice)}
                                </Typography>
                                <Typography variant="body1" fontWeight="bold" color="success.main">
                                  {formatCurrency(item.price)}
                                </Typography>
                              </>
                            ) : (
                              <Typography>{formatCurrency(item.price)}</Typography>
                            )}
                          </Box>
                        </TableCell>

                        <TableCell align="center">
                          <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                            <IconButton
                              onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                              sx={{ color: "green" }}
                            >
                              <Add />
                            </IconButton>
                            <Typography variant="body1" sx={{ minWidth: 22, textAlign: "center", fontWeight: 700 }}>
                              {item.quantity}
                            </Typography>
                            <IconButton
                              onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                              sx={{ color: "orange" }}
                            >
                              <Remove />
                            </IconButton>
                          </Box>
                        </TableCell>

                        <TableCell align="center">
                          <IconButton
                            color="error"
                            onClick={() => handleDelete(item._id)}
                            sx={{ '&:hover': { backgroundColor: "rgba(255, 0, 0, 0.1)" } }}
                          >
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>

            <Paper
              elevation={0}
              sx={{ p: 2.5, borderRadius: 3, border: "1px solid #eee", height: "fit-content", background: "#fff" }}
            >
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Price Summary
              </Typography>
              <Divider sx={{ my: 1.5 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography color="text.secondary">Items ({getTotalItems()})</Typography>
                <Typography>{formatCurrency(getTotal())}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography color="text.secondary">Delivery</Typography>
                <Typography sx={{ color: "#2e7d32", fontWeight: 700 }}>FREE</Typography>
              </Box>

              <Divider sx={{ my: 1.2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ fontWeight: 800 }}>Total Amount</Typography>
                <Typography sx={{ fontWeight: 800 }}>{formatCurrency(getTotal())}</Typography>
              </Box>

              <Button
                fullWidth
                variant="contained"
                sx={{
                  mt: 2,
                  backgroundColor: "#2ecc71",
                  color: "#fff",
                  textTransform: "none",
                  fontWeight: 800,
                  borderRadius: 2,
                  '&:hover': { backgroundColor: "#27b764" },
                }}
                onClick={() =>
                  navigate("/checkout", {
                    state: {
                      cartItems,
                      totalAmount: getTotal(),
                      user,
                    },
                  })
                }
              >
                Proceed to Pay
              </Button>

              <Box mt={2} p={1.5} bgcolor="#f8f8f8" borderRadius={2}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700, mb: 0.5 }}>
                  Bulk Discount Info
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  Buy 30-49 of same product: 15% discount
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  Buy 50+ of same product: 20% discount
                </Typography>
              </Box>
            </Paper>
          </Box>
        )}
      </Box>
    </Box>

  );
};

export default CartPage;



