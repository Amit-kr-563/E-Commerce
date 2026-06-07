
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
  boxSizing: "border-box"
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
      <Typography variant="body1" sx={{ fontWeight: 600, wordBreak: "break-word" }}>
        {value || "-"}
      </Typography>
    </Box>
  );

  return (
    /* Global Page Wrapper - Strictly anchors the view to prevent shaking */
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        overflowX: "hidden",
        p: { xs: 1.5, sm: 2, md: 4 },
        background: "linear-gradient(180deg, #fffdf3 0%, #fff8d8 45%, #fff 100%)",
        boxSizing: "border-box",
      }}
    >
      {/* Container to handle perfect structural alignments */}
      <Box sx={{ width: "100%", maxWidth: "1240px", margin: "0 auto", boxSizing: "border-box" }}>
        
        {/* Dashboard Title Header */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 3,
            border: "2px solid #ffe680",
            mb: 3,
            background: "#fff",
            boxSizing: "border-box"
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#111", fontSize: { xs: "24px", sm: "32px", md: "36px" } }}>
            Admin Dashboard
          </Typography>
          <Typography variant="body1" sx={{ color: "#666", mt: 0.5, fontSize: { xs: "14px", sm: "16px" } }}>
            Manage orders, users, and sellers from one place.
          </Typography>
        </Paper>

        {/* Top Analytics Cards Grid */}
        <Grid container spacing={2} sx={{ mb: 3, width: "100%", margin: "0 0 24px 0 !important" }}>
          <Grid item xs={12} sm={6} md={3} sx={{ pl: "0px !important", pr: { xs: "0px", sm: "16px" }, pb: "16px" }}>
            <Paper sx={cardStyle}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography sx={{ color: "#666", fontWeight: 500 }}>Total Orders</Typography>
                <ShoppingBagIcon sx={{ color: "#c9a600" }} />
              </Stack>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 800, fontSize: { xs: "28px", md: "34px" } }}>
                {stats.totalOrders}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ pl: { xs: "0px", sm: "16px" }, pr: { xs: "0px", md: "16px" }, pb: "16px" }}>
            <Paper sx={cardStyle}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography sx={{ color: "#666", fontWeight: 500 }}>Users</Typography>
                <GroupIcon sx={{ color: "#1565c0" }} />
              </Stack>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 800, fontSize: { xs: "28px", md: "34px" } }}>
                {stats.totalUsers}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ pl: { xs: "0px", md: "16px" }, pr: { xs: "0px", sm: "16px" }, pb: "16px" }}>
            <Paper sx={cardStyle}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography sx={{ color: "#666", fontWeight: 500 }}>Sellers</Typography>
                <StorefrontIcon sx={{ color: "#2e7d32" }} />
              </Stack>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 800, fontSize: { xs: "28px", md: "34px" } }}>
                {stats.totalSellers}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3} sx={{ pl: { xs: "0px", sm: "16px" }, pr: "0px !important", pb: "16px" }}>
            <Paper sx={cardStyle}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography sx={{ color: "#666", fontWeight: 500 }}>Today's Logins</Typography>
                <LoginIcon sx={{ color: "#6a1b9a" }} />
              </Stack>
              <Typography variant="h4" sx={{ mt: 1, fontWeight: 800, fontSize: { xs: "28px", md: "34px" } }}>
                {stats.todayLogins}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Tab Controls */}
        <Paper sx={{ ...cardStyle, p: 1.5, mb: 3 }}>
          <Stack direction="row" spacing={1.5}>
            <Button
              variant={activeTab === "orders" ? "contained" : "outlined"}
              onClick={() => setActiveTab("orders")}
              sx={{ textTransform: "none", borderRadius: 2, fontWeight: 700, px: { xs: 3, sm: 4 } }}
            >
              Orders
            </Button>
            <Button
              variant={activeTab === "accounts" ? "contained" : "outlined"}
              onClick={() => setActiveTab("accounts")}
              sx={{ textTransform: "none", borderRadius: 2, fontWeight: 700, px: { xs: 2, sm: 4 } }}
            >
              Users & Sellers
            </Button>
          </Stack>
        </Paper>

        {/* Active Tab Elements Display rendering */}
        {/* ==================== ORDERS TAB ==================== */}
        {activeTab === "orders" && (
          <>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: "#1e293b" }}>
              All User Orders
            </Typography>

            {orders.length === 0 ? (
              <Paper sx={{ ...cardStyle, textAlign: "center", py: 4 }}>
                <Typography sx={{ color: "#64748b" }}>No orders found.</Typography>
              </Paper>
            ) : (
              orders.map((order, idx) => (
                <Paper key={idx} sx={{ ...cardStyle, mb: 3, p: { xs: 2, sm: 3 } }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: "#1e293b" }}>
                    Order #{idx + 1}
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mt: 0.5, width: "100%", margin: "4px 0 0 0 !important" }}>
                    <Grid item xs={12} md={6} sx={{ p: "0px !important", pb: { xs: 1, md: 0 } }}>
                      <Typography sx={{ py: 0.3 }}><strong>Username:</strong> {order.username}</Typography>
                      <Typography sx={{ py: 0.3 }}><strong>Name:</strong> {order.fullName}</Typography>
                      <Typography sx={{ py: 0.3, wordBreak: "break-all" }}><strong>Email:</strong> {order.email}</Typography>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ p: "0px !important" }}>
                      <Typography sx={{ py: 0.3 }}><strong>Mobile:</strong> {order.mobile}</Typography>
                      <Typography sx={{ py: 0.3 }}><strong>Address:</strong> {order.address}</Typography>
                      <Typography sx={{ py: 0.3 }}>
                        <strong>Payment:</strong> {order.paymentMethod} {order.bank ? `(${order.bank})` : ""}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 2 }} />

                  {/* Horizontal Scroll Safe Table Wrapper */}
                  <TableContainer sx={{ width: "100%", overflowX: "auto", borderRadius: 2, border: "1px solid #e2e8f0" }}>
                    <Table size="small" sx={{ minWidth: 500 }}>
                      <TableHead>
                        <TableRow sx={{ background: "#fff8d9" }}>
                          <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Quantity</TableCell>
                          <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(order.cartItems || []).map((item, i) => (
                          <TableRow key={i}>
                            <TableCell sx={{ fontWeight: 500 }}>{item.name}</TableCell>
                            <TableCell>₹{item.price}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>₹{item.price * item.quantity}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Typography variant="h6" align="right" sx={{ mt: 2.5, fontWeight: 900, color: "#111" }}>
                    Grand Total: ₹{order.totalAmount}
                  </Typography>
                </Paper>
              ))
            )}
          </>
        )}

        {activeTab === "accounts" && (
          <Paper sx={{ ...cardStyle, p: { xs: 1.5, sm: 2, md: 3 } }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, color: "#1e293b" }}>
              Login Details (Users + Sellers)
            </Typography>

            {/* Horizontal Scroll Safe Table Wrapper */}
            <TableContainer sx={{ width: "100%", overflowX: "auto", borderRadius: 2, border: "1px solid #e2e8f0" }}>
              <Table size="small" sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow sx={{ background: "#fff8d9" }}>
                    <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Mobile</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Last Login</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Login Count</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {accounts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 3, color: "#64748b" }}>No accounts found</TableCell>
                    </TableRow>
                  ) : (
                    accounts.map((account, index) => (
                      <TableRow key={account._id} sx={{ background: index % 2 === 0 ? "#fff" : "#fffef5" }}>
                        <TableCell sx={{ fontWeight: 500 }}>{account.name || "-"}</TableCell>
                        <TableCell>{account.email || "-"}</TableCell>
                        <TableCell>{account.mobile || "-"}</TableCell>
                        <TableCell>
                          <Chip
                            label={account.role}
                            size="small"
                            color={account.role === "seller" ? "warning" : "default"}
                            sx={{ fontWeight: 600, textTransform: "capitalize" }}
                          />
                        </TableCell>
                        <TableCell>{formatDate(account.lastLoginAt)}</TableCell>
                        <TableCell align="center">{account.loginCount || 0}</TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => openProfile(account)}
                              sx={{ textTransform: "none", borderRadius: 1.5, fontWeight: 600 }}
                            >
                              View
                            </Button>
                            <IconButton
                              color="error"
                              onClick={() => handleRemoveAccount(account)}
                              title={`Remove ${account.role}`}
                              size="small"
                            >
                              <DeleteOutlineIcon fontSize="small" />
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
      </Box>

      {/* Profile Dialog System */}
      <Dialog 
        open={Boolean(selectedAccount)} 
        onClose={closeProfile} 
        fullWidth 
        maxWidth="md"
        PaperProps={{
          sx: { borderRadius: 3, p: { xs: 1, sm: 2 }, boxSizing: "border-box" }
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, fontSize: "1.35rem", pb: 1 }}>
          {selectedAccount?.role === "seller" ? "Seller Full Profile" : "User Full Profile"}
        </DialogTitle>
        <DialogContent dividers sx={{ borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0" }}>
          {selectedAccount && (
            <Grid container spacing={2} sx={{ width: "100%", margin: "0 !important" }}>
              <Grid item xs={12} sx={{ p: "0px !important", mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#1e293b" }}>Personal & Login</Typography>
                <Divider sx={{ mt: 0.5 }} />
              </Grid>
              <Grid item xs={12} sm={6} sx={{ p: "0px !important", pb: 1 }}><DetailRow label="Name" value={selectedAccount.name} /></Grid>
              <Grid item xs={12} sm={6} sx={{ p: "0px !important", pb: 1 }}><DetailRow label="Role" value={selectedAccount.role} /></Grid>
              <Grid item xs={12} sm={6} sx={{ p: "0px !important", pb: 1 }}><DetailRow label="Email" value={selectedAccount.email} /></Grid>
              <Grid item xs={12} sm={6} sx={{ p: "0px !important", pb: 1 }}><DetailRow label="Mobile" value={selectedAccount.mobile} /></Grid>
              <Grid item xs={12} sm={6} sx={{ p: "0px !important", pb: 1 }}><DetailRow label="Last Login" value={formatDate(selectedAccount.lastLoginAt)} /></Grid>
              <Grid item xs={12} sm={6} sx={{ p: "0px !important", pb: 1 }}><DetailRow label="Login Count" value={String(selectedAccount.loginCount || 0)} /></Grid>

              {selectedAccount.role === "seller" && (
                <>
                  <Grid item xs={12} sx={{ p: "0px !important", mt: 2, mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#1e293b" }}>Business Info</Typography>
                    <Divider sx={{ mt: 0.5 }} />
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ p: "0px !important", pb: 1 }}><DetailRow label="Shop Name" value={selectedAccount.shopName} /></Grid>
                  <Grid item xs={12} sm={6} sx={{ p: "0px !important", pb: 1 }}><DetailRow label="Business Category" value={selectedAccount.businessCategory} /></Grid>
                  <Grid item xs={12} sx={{ p: "0px !important", pb: 1 }}><DetailRow label="Business Description" value={selectedAccount.businessDescription} /></Grid>

                  <Grid item xs={12} sx={{ p: "0px !important", mt: 2, mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#1e293b" }}>Document Verification</Typography>
                    <Divider sx={{ mt: 0.5 }} />
                  </Grid>
                  <Grid item xs={12} sm={4} sx={{ p: "0px !important", pb: 1 }}><DetailRow label="PAN Number" value={selectedAccount.panCard} /></Grid>
                  <Grid item xs={12} sm={4} sx={{ p: "0px !important", pb: 1 }}><DetailRow label="Aadhar Number" value={selectedAccount.aadhaar} /></Grid>
                  <Grid item xs={12} sm={4} sx={{ p: "0px !important", pb: 1 }}><DetailRow label="GST Number" value={selectedAccount.gstNumber} /></Grid>
                </>
              )}

              <Grid item xs={12} sx={{ p: "0px !important", mt: 2, mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#1e293b" }}>Addresses</Typography>
                <Divider sx={{ mt: 0.5 }} />
              </Grid>
              <Grid item xs={12} sx={{ p: "0px !important", pb: 1 }}><DetailRow label="Address" value={`${selectedAccount.addressLine || '-'}, ${selectedAccount.city || '-'}, ${selectedAccount.state || '-'} - ${selectedAccount.pincode || '-'}`} /></Grid>

              {selectedAccount.role === "seller" && (
                <>
                  <Grid item xs={12} sx={{ p: "0px !important", pb: 1 }}><DetailRow label="Pickup Address" value={`${selectedAccount.pickupAddressLine || '-'}, ${selectedAccount.pickupCity || '-'}, ${selectedAccount.pickupState || '-'} - ${selectedAccount.pickupPincode || '-'}`} /></Grid>
                  <Grid item xs={12} sx={{ p: "0px !important", pb: 1 }}><DetailRow label="Return Address" value={`${selectedAccount.returnAddressLine || '-'}, ${selectedAccount.returnCity || '-'}, ${selectedAccount.returnState || '-'} - ${selectedAccount.returnPincode || '-'}`} /></Grid>
                  <Grid item xs={12} sm={6} sx={{ p: "0px !important", pb: 1 }}><DetailRow label="Pickup Contact" value={selectedAccount.pickupContactNumber} /></Grid>
                  <Grid item xs={12} sm={6} sx={{ p: "0px !important", pb: 1 }}><DetailRow label="Shipping Method" value={selectedAccount.shippingMethod} /></Grid>

                  <Grid item xs={12} sx={{ p: "0px !important", mt: 2, mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "#1e293b" }}>Bank Details</Typography>
                    <Divider sx={{ mt: 0.5 }} />
                  </Grid>
                  <Grid item xs={12} sm={6} sx={{ p: "0px !important", pb: 1 }}><DetailRow label="Account Holder" value={selectedAccount.accountHolderName} /></Grid>
                  <Grid item xs={12} sm={6} sx={{ p: "0px !important", pb: 1 }}><DetailRow label="Account Number" value={selectedAccount.accountNumber} /></Grid>
                  <Grid item xs={12} sm={6} sx={{ p: "0px !important", pb: 1 }}><DetailRow label="IFSC" value={selectedAccount.ifscCode} /></Grid>
                  <Grid item xs={12} sm={6} sx={{ p: "0px !important", pb: 1 }}><DetailRow label="Bank Name" value={selectedAccount.bankName} /></Grid>
                </>
              )}

              <Grid item xs={12} sx={{ mt: 3, p: "0px !important", display: "flex", justifyContent: "flex-end", gap: 1.5, flexWrap: "wrap" }}>
                <Button variant="outlined" onClick={closeProfile} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}>Close</Button>
                <Button
                  variant="contained"
                  color="error"
                  sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}
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