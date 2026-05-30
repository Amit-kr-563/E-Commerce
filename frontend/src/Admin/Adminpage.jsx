import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import GroupIcon from "@mui/icons-material/Group";
import StorefrontIcon from "@mui/icons-material/Storefront";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LoginIcon from "@mui/icons-material/Login";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const cardStyle = {
  p: 2,
  borderRadius: 3,
  border: "1px solid #f1e4a3",
  boxShadow: "0 8px 22px rgba(0,0,0,0.06)",
  background: "#fff",
};

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [activeTab, setActiveTab] = useState("orders");
  const [selectedAccount, setSelectedAccount] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (!isAdmin) {
      navigate("/admin");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:8000/order/all");
        setOrders(res.data || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      }
    };

    fetchOrders();
  }, []);

  const fetchAccounts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/admin/accounts");
      setAccounts(res.data || []);
    } catch (err) {
      console.error("Failed to fetch accounts:", err);
      Swal.fire("Error", "Failed to fetch users/sellers", "error");
    }
  };

  useEffect(() => {
    if (activeTab === "accounts") {
      fetchAccounts();
    }
  }, [activeTab]);

  const formatDate = (value) => {
    if (!value) return "Never logged in";
    return new Date(value).toLocaleString();
  };

  const handleRemoveAccount = async (account) => {
    const result = await Swal.fire({
      title: `Remove this ${account.role}?`,
      text: `${account.role}: ${account.name || account.email || account.mobile}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, remove",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#d33",
    });

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:8000/admin/accounts/${account._id}`);
      setAccounts((prev) => prev.filter((a) => a._id !== account._id));
      Swal.fire("Removed", `${account.role} account removed successfully`, "success");
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Could not remove account", "error");
    }
  };

  const openProfile = (account) => {
    setSelectedAccount(account);
  };

  const closeProfile = () => {
    setSelectedAccount(null);
  };

  const stats = useMemo(() => {
    const sellers = accounts.filter((a) => a.role === "seller").length;
    const users = accounts.filter((a) => a.role === "user").length;
    const todayLogins = accounts.filter((a) => {
      if (!a.lastLoginAt) return false;
      const date = new Date(a.lastLoginAt);
      const now = new Date();
      return (
        date.getDate() === now.getDate() &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    }).length;

    return {
      totalOrders: orders.length,
      totalUsers: users,
      totalSellers: sellers,
      todayLogins,
    };
  }, [orders, accounts]);

  const DetailRow = ({ label, value }) => (
    <Box sx={{ py: 0.8 }}>
      <Typography variant="body2" sx={{ color: "#666" }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 600 }}>
        {value || "-"}
      </Typography>
    </Box>
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: { xs: 2, md: 4 },
        background: "linear-gradient(180deg, #fffdf3 0%, #fff8d8 45%, #fff 100%)",
      }}
    >
      <Paper
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 3,
          border: "2px solid #ffe680",
          mb: 3,
          background: "#fff",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 800, color: "#111" }}>
          Admin Dashboard
        </Typography>
        <Typography variant="body1" sx={{ color: "#666", mt: 0.5 }}>
          Manage orders, users, and sellers from one place.
        </Typography>
      </Paper>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={cardStyle}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography sx={{ color: "#666" }}>Total Orders</Typography>
              <ShoppingBagIcon sx={{ color: "#c9a600" }} />
            </Stack>
            <Typography variant="h4" sx={{ mt: 1, fontWeight: 800 }}>
              {stats.totalOrders}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={cardStyle}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography sx={{ color: "#666" }}>Users</Typography>
              <GroupIcon sx={{ color: "#1565c0" }} />
            </Stack>
            <Typography variant="h4" sx={{ mt: 1, fontWeight: 800 }}>
              {stats.totalUsers}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={cardStyle}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography sx={{ color: "#666" }}>Sellers</Typography>
              <StorefrontIcon sx={{ color: "#2e7d32" }} />
            </Stack>
            <Typography variant="h4" sx={{ mt: 1, fontWeight: 800 }}>
              {stats.totalSellers}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={cardStyle}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Typography sx={{ color: "#666" }}>Today's Logins</Typography>
              <LoginIcon sx={{ color: "#6a1b9a" }} />
            </Stack>
            <Typography variant="h4" sx={{ mt: 1, fontWeight: 800 }}>
              {stats.todayLogins}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Paper sx={{ ...cardStyle, mb: 3 }}>
        <Stack direction="row" spacing={1}>
          <Button
            variant={activeTab === "orders" ? "contained" : "outlined"}
            onClick={() => setActiveTab("orders")}
            sx={{ textTransform: "none", borderRadius: 2, fontWeight: 700 }}
          >
            Orders
          </Button>
          <Button
            variant={activeTab === "accounts" ? "contained" : "outlined"}
            onClick={() => setActiveTab("accounts")}
            sx={{ textTransform: "none", borderRadius: 2, fontWeight: 700 }}
          >
            Users & Sellers
          </Button>
        </Stack>
      </Paper>

      {activeTab === "orders" && (
        <>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            All User Orders
          </Typography>

          {orders.length === 0 ? (
            <Paper sx={{ ...cardStyle, textAlign: "center" }}>
              <Typography>No orders found.</Typography>
            </Paper>
          ) : (
            orders.map((order, idx) => (
              <Paper key={idx} sx={{ ...cardStyle, mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Order #{idx + 1}
                </Typography>
                <Grid container spacing={1} sx={{ mt: 0.5 }}>
                  <Grid item xs={12} md={6}>
                    <Typography><strong>Username:</strong> {order.username}</Typography>
                    <Typography><strong>Name:</strong> {order.fullName}</Typography>
                    <Typography><strong>Email:</strong> {order.email}</Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography><strong>Mobile:</strong> {order.mobile}</Typography>
                    <Typography><strong>Address:</strong> {order.address}</Typography>
                    <Typography>
                      <strong>Payment:</strong> {order.paymentMethod} {order.bank ? `(${order.bank})` : ""}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ background: "#fff8d9" }}>
                        <TableCell>Product</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(order.cartItems || []).map((item, i) => (
                        <TableRow key={i}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>₹{item.price}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>₹{item.price * item.quantity}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Typography variant="h6" align="right" sx={{ mt: 2, fontWeight: 800 }}>
                  Grand Total: ₹{order.totalAmount}
                </Typography>
              </Paper>
            ))
          )}
        </>
      )}

      {activeTab === "accounts" && (
        <Paper sx={{ ...cardStyle }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Login Details (Users + Sellers)
          </Typography>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ background: "#fff8d9" }}>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Mobile</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Last Login</TableCell>
                  <TableCell>Login Count</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {accounts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">No accounts found</TableCell>
                  </TableRow>
                ) : (
                  accounts.map((account, index) => (
                    <TableRow key={account._id} sx={{ background: index % 2 === 0 ? "#fff" : "#fffef5" }}>
                      <TableCell>{account.name || "-"}</TableCell>
                      <TableCell>{account.email || "-"}</TableCell>
                      <TableCell>{account.mobile || "-"}</TableCell>
                      <TableCell>
                        <Chip
                          label={account.role}
                          size="small"
                          color={account.role === "seller" ? "warning" : "default"}
                        />
                      </TableCell>
                      <TableCell>{formatDate(account.lastLoginAt)}</TableCell>
                      <TableCell>{account.loginCount || 0}</TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => openProfile(account)}
                            sx={{ textTransform: "none" }}
                          >
                            View Profile
                          </Button>
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveAccount(account)}
                            title={`Remove ${account.role}`}
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      <Dialog open={Boolean(selectedAccount)} onClose={closeProfile} fullWidth maxWidth="md">
        <DialogTitle>
          {selectedAccount?.role === "seller" ? "Seller Full Profile" : "User Full Profile"}
        </DialogTitle>
        <DialogContent dividers>
          {selectedAccount && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 1 }}>Personal & Login</Typography>
                <Divider sx={{ mb: 1 }} />
              </Grid>
              <Grid item xs={12} sm={6}><DetailRow label="Name" value={selectedAccount.name} /></Grid>
              <Grid item xs={12} sm={6}><DetailRow label="Role" value={selectedAccount.role} /></Grid>
              <Grid item xs={12} sm={6}><DetailRow label="Email" value={selectedAccount.email} /></Grid>
              <Grid item xs={12} sm={6}><DetailRow label="Mobile" value={selectedAccount.mobile} /></Grid>
              <Grid item xs={12} sm={6}><DetailRow label="Last Login" value={formatDate(selectedAccount.lastLoginAt)} /></Grid>
              <Grid item xs={12} sm={6}><DetailRow label="Login Count" value={String(selectedAccount.loginCount || 0)} /></Grid>

              {selectedAccount.role === "seller" && (
                <>
                  <Grid item xs={12} sx={{ mt: 1 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>Business Info</Typography>
                    <Divider sx={{ mb: 1 }} />
                  </Grid>
                  <Grid item xs={12} sm={6}><DetailRow label="Shop Name" value={selectedAccount.shopName} /></Grid>
                  <Grid item xs={12} sm={6}><DetailRow label="Business Category" value={selectedAccount.businessCategory} /></Grid>
                  <Grid item xs={12}><DetailRow label="Business Description" value={selectedAccount.businessDescription} /></Grid>

                  <Grid item xs={12} sx={{ mt: 1 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>Document Verification</Typography>
                    <Divider sx={{ mb: 1 }} />
                  </Grid>
                  <Grid item xs={12} sm={4}><DetailRow label="PAN Number" value={selectedAccount.panCard} /></Grid>
                  <Grid item xs={12} sm={4}><DetailRow label="Aadhar Number" value={selectedAccount.aadhaar} /></Grid>
                  <Grid item xs={12} sm={4}><DetailRow label="GST Number" value={selectedAccount.gstNumber} /></Grid>
                </>
              )}

              <Grid item xs={12} sx={{ mt: 1 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>Addresses</Typography>
                <Divider sx={{ mb: 1 }} />
              </Grid>
              <Grid item xs={12}><DetailRow label="Address" value={`${selectedAccount.addressLine || '-'}, ${selectedAccount.city || '-'}, ${selectedAccount.state || '-'} - ${selectedAccount.pincode || '-'}`} /></Grid>

              {selectedAccount.role === "seller" && (
                <>
                  <Grid item xs={12}><DetailRow label="Pickup Address" value={`${selectedAccount.pickupAddressLine || '-'}, ${selectedAccount.pickupCity || '-'}, ${selectedAccount.pickupState || '-'} - ${selectedAccount.pickupPincode || '-'}`} /></Grid>
                  <Grid item xs={12}><DetailRow label="Return Address" value={`${selectedAccount.returnAddressLine || '-'}, ${selectedAccount.returnCity || '-'}, ${selectedAccount.returnState || '-'} - ${selectedAccount.returnPincode || '-'}`} /></Grid>
                  <Grid item xs={12} sm={6}><DetailRow label="Pickup Contact" value={selectedAccount.pickupContactNumber} /></Grid>
                  <Grid item xs={12} sm={6}><DetailRow label="Shipping Method" value={selectedAccount.shippingMethod} /></Grid>

                  <Grid item xs={12} sx={{ mt: 1 }}>
                    <Typography variant="h6" sx={{ mb: 1 }}>Bank Details</Typography>
                    <Divider sx={{ mb: 1 }} />
                  </Grid>
                  <Grid item xs={12} sm={6}><DetailRow label="Account Holder" value={selectedAccount.accountHolderName} /></Grid>
                  <Grid item xs={12} sm={6}><DetailRow label="Account Number" value={selectedAccount.accountNumber} /></Grid>
                  <Grid item xs={12} sm={6}><DetailRow label="IFSC" value={selectedAccount.ifscCode} /></Grid>
                  <Grid item xs={12} sm={6}><DetailRow label="Bank Name" value={selectedAccount.bankName} /></Grid>
                </>
              )}

              <Grid item xs={12} sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1 }}>
                <Button variant="outlined" onClick={closeProfile}>Close</Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => {
                    handleRemoveAccount(selectedAccount);
                    closeProfile();
                  }}
                >
                  Remove {selectedAccount?.role === "seller" ? "Seller" : "User"}
                </Button>
              </Grid>
            </Grid>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AdminOrdersPage;
