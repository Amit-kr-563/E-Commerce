import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  Divider,
  IconButton,
  Stack
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const WatchlistPage = ({username}) => {
  const [watchlist, setWatchlist] = useState([]);
  const navigate = useNavigate();
  const user = username|| JSON.parse(localStorage.getItem("loggedInUser"))?.user;

  useEffect(() => {
    if (!user) {
   
  Swal.fire({
  toast: true,
  position: 'top',
  icon: 'warning',
  title: 'Please login first',
  showConfirmButton: false,
  
});
      navigate("/login");
      return;
    }

    const fetchWatchlist = async () => {
      const username = user.email || user.mobile;
      try {
        const res = await axios.get(`http://localhost:8000/watchlist/${username}`);
        setWatchlist(res.data);
      } catch (err) {
        console.error("Error loading watchlist", err);
      }
    };

    fetchWatchlist();
  }, [user, navigate]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/watchlist/${id}`);
      setWatchlist(watchlist.filter((item) => item._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };
  const handleMoveToCart = async (item) => {
    const username = user.email || user.mobile;
    try {
      await axios.post("http://localhost:8000/cart", {
        username,
        product: { ...item, quantity: 1 },
      });
      await axios.delete(`http://localhost:8000/watchlist/${item._id}`);
      setWatchlist(watchlist.filter((w) => w._id !== item._id));
      window.dispatchEvent(new Event("cart-updated"));
      
     Swal.fire({
  toast: true,
  position: 'top',
  icon: 'success',
  title: 'Moved to cart',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true
});
    } catch (err) {
      console.error("Error moving to cart:", err);
    }
  };


  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #fffdf3 0%, #fff8d8 42%, #fff 100%)",
        py: 4,
        px: { xs: 1.5, md: 3 },
      }}
    >
      <Box sx={{ maxWidth: 1150, mx: "auto" }}>
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
            Your Watchlist
          </Typography>
          <Typography variant="body1" sx={{ color: "#666", mt: 0.5 }}>
            {watchlist.length} item{watchlist.length !== 1 ? "s" : ""} saved for later
          </Typography>
        </Paper>

        {watchlist.length === 0 ? (
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
              No items in watchlist
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 1, mb: 2 }}>
              Save products to your watchlist and move them to cart anytime.
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
              Explore Products
            </Button>
          </Paper>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "1fr 1fr 1fr" },
              gap: 2,
            }}
          >
            {watchlist.map((item) => (
              <Paper
                key={item._id}
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  border: "1px solid #ececec",
                  background: "#fff",
                  boxShadow: "0 6px 14px rgba(0,0,0,0.05)",
                }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="start" spacing={1}>
                  <Avatar
                    sx={{ width: 88, height: 110, borderRadius: 2, bgcolor: "#f5f5f5" }}
                    variant="square"
                    src={item.img}
                    alt={item.name}
                  />
                  <IconButton onClick={() => handleDelete(item._id)} color="error" title="Remove from watchlist">
                    <Delete />
                  </IconButton>
                </Stack>

                <Typography sx={{ mt: 1.5, fontWeight: 700, minHeight: 48 }}>
                  {item.name}
                </Typography>
                <Typography sx={{ color: "#2e7d32", fontWeight: 800, mb: 1.5 }}>
                  ₹{item.price}
                </Typography>

                <Divider sx={{ mb: 1.5 }} />

                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleMoveToCart(item)}
                    sx={{
                      width: "100%",
                      textTransform: "none",
                      fontWeight: 700,
                      backgroundColor: "#2ecc71",
                      '&:hover': { backgroundColor: "#27b764" },
                    }}
                  >
                    Move to Cart
                  </Button>
                </Stack>
              </Paper>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default WatchlistPage;
