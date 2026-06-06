

import React, { useEffect, useState, useCallback, useRef } from "react";
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
  Chip,
  useTheme,
  useMediaQuery
} from "@mui/material";
import Swal from "sweetalert2";
import { Delete, Add, Remove } from "@mui/icons-material";

const CartPage = ({ username }) => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  
  // Responsive design ke liye hooks (Mobile detecting)
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  
  const user = username || JSON.parse(localStorage.getItem("loggedInUser"))?.user;
  const userKey = user?.email || user?.mobile;

  const debounceTimers = useRef({});
  const latestQuantities = useRef({});

  // 1. Initial Cart Fetching
  const fetchCart = useCallback(async () => {
    if (!userKey) return;
    try {
      const res = await axios.get(`http://localhost:8000/cart/${userKey}`);
      setCartItems((prevItems) => {
        return res.data.map((serverItem) => {
          if (latestQuantities.current[serverItem._id] !== undefined) {
            return { ...serverItem, quantity: latestQuantities.current[serverItem._id] };
          }
          return serverItem;
        });
      });
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  }, [userKey]);

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
    fetchCart();

    const currentTimers = debounceTimers.current;
    const currentQuantities = latestQuantities.current;

    return () => {
      Object.keys(currentTimers).forEach((id) => {
        clearTimeout(currentTimers[id]);
        const finalQty = currentQuantities[id];
        if (finalQty) {
          axios.put(`http://localhost:8000/cart/${id}`, { quantity: finalQty }).catch((e) => {});
        }
      });
    };
  }, [user, navigate, fetchCart]);

  // 2. Core DB Sync Trigger
  const syncQuantityWithBackend = async (id, finalQty) => {
    try {
      const res = await axios.put(`http://localhost:8000/cart/${id}`, {
        quantity: finalQty,
      });

      if (res.data) {
        setCartItems((prevItems) =>
          prevItems.map((item) => {
            if (item._id === id && latestQuantities.current[id] === finalQty) {
              return {
                ...item,
                quantity: res.data.quantity,
                price: res.data.price,
                bulkDiscount: res.data.bulkDiscount,
                originalPrice: res.data.originalPrice
              };
            }
            return item;
          })
        );
      }
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      console.error("Failed to sync quantity with MongoDB:", err);
    } finally {
      if (latestQuantities.current[id] === finalQty) {
        delete latestQuantities.current[id];
      }
    }
  };

  // 3. User Interaction Controller
  const handleQuantityChange = (id, newQty) => {
    if (newQty < 1) return;

    latestQuantities.current[id] = newQty;

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === id ? { ...item, quantity: newQty } : item
      )
    );

    if (debounceTimers.current[id]) {
      clearTimeout(debounceTimers.current[id]);
    }

    debounceTimers.current[id] = setTimeout(() => {
      syncQuantityWithBackend(id, newQty);
      delete debounceTimers.current[id];
    }, 400);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/cart/${id}`);
      setCartItems(cartItems.filter((item) => item._id !== id));
      window.dispatchEvent(new Event("cart-updated"));
    } catch (err) {
      console.error("Failed to delete item:", err);
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
        {/* Header Section */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            border: "2px solid #ffe680",
            borderRadius: 3,
            mb: 2,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#111", fontSize: { xs: "1.8rem", md: "2.125rem" } }}>
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
            
            {/* Products Layout Layer */}
            <Box>
              {isMobile ? (
                /* === MOBILE VIEW: Cards Representation === */
                <Box display="flex" flexDirection="column" gap={2}>
                  {cartItems.map((item) => (
                    <Paper 
                      key={item._id} 
                      elevation={0} 
                      sx={{ p: 2, borderRadius: 3, border: "1px solid #eee", background: "#fff" }}
                    >
                      <Box display="flex" gap={2}>
                        <Avatar
                          src={item.img}
                          alt={item.name}
                          variant="square"
                          sx={{ width: 80, height: 100, borderRadius: 2 }}
                        />
                        <Box flex={1} display="flex" flexDirection="column" justifyContent="space-between">
                          <Box>
                            <Typography sx={{ fontWeight: 700, fontSize: "1rem", lineHeight: 1.2 }}>{item.name}</Typography>
                            {item.bulkDiscount > 0 && (
                              <Chip
                                label={`${item.bulkDiscount}% Bulk Discount`}
                                color="success"
                                size="small"
                                sx={{ mt: 0.5, fontSize: "0.75rem" }}
                              />
                            )}
                          </Box>

                          {/* Pricing for Mobile */}
                          <Box mt={1}>
                            {item.bulkDiscount > 0 ? (
                              <Box display="flex" alignItems="center" gap={1}>
                                <Typography variant="body2" sx={{ textDecoration: "line-through", color: "text.secondary" }}>
                                  {formatCurrency(item.originalPrice)}
                                </Typography>
                                <Typography variant="body1" fontWeight="bold" color="success.main">
                                  {formatCurrency(item.price)}
                                </Typography>
                              </Box>
                            ) : (
                              <Typography fontWeight="700">{formatCurrency(item.price)}</Typography>
                            )}
                          </Box>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 1.5, borderStyle: "dashed" }} />

                      {/* Controls Footer on Mobile Card */}
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(item._id)}
                          sx={{ p: 1, backgroundColor: "rgba(255, 0, 0, 0.05)", '&:hover': { backgroundColor: "rgba(255, 0, 0, 0.1)" } }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>

                        <Box display="flex" alignItems="center" gap={1} sx={{ backgroundColor: "#f9f9f9", borderRadius: 2, p: 0.5 }}>
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                            sx={{ color: "orange" }}
                          >
                            <Remove fontSize="small" />
                          </IconButton>
                          <Typography variant="body1" sx={{ minWidth: 25, textAlign: "center", fontWeight: 700 }}>
                            {item.quantity}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                            sx={{ color: "green" }}
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              ) : (
                /* === DESKTOP VIEW: Regular Table UI === */
                <Paper elevation={0} sx={{ borderRadius: 3, border: "1px solid #eee", overflow: "hidden" }}>
                  <TableContainer sx={{ overflowX: "auto" }}>
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
              )}
            </Box>

            {/* Price Summary Panel (Responsive Adaptable) */}
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
                  py: { xs: 1.5, md: 1 }, // Mobile par bada tap target area bnaega
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

