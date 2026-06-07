// import React, { useState } from "react";
// import {
//   Box,
//   Button,
//   TextField,
//   Typography,
//   Paper
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
// import "./Adminlogin.css";

// const AdminLogin = () => {
//   const [admin, setAdmin] = useState({ username: "", password: "" });
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setAdmin({ ...admin, [e.target.name]: e.target.value });
//   };

//   const handleLogin = (e) => {
//     e.preventDefault();
//     const { username, password } = admin;

//     // Hardcoded admin login
//     if (username === "admin" && password === "admin123") {
//       localStorage.setItem("isAdmin", true);
//       navigate("/admin/orders");
//     } else {
//            Swal.fire({
//               toast: true,
//               position: 'top',
//               icon: 'warning',
//               title: 'Invalid Admin Credentials',
//               showConfirmButton: false,
//               timer: 2000,
//               timerProgressBar: true
//             });
//     }
//   };

//   return (
//     <Box className="admin-login-page-root">
//       <span className="admin-login-glow admin-login-glow-left" aria-hidden="true" />
//       <span className="admin-login-glow admin-login-glow-right" aria-hidden="true" />

//       <Paper elevation={0} className="admin-login-card">
//         <Typography className="admin-login-brand" component="h1">
//           SudoCart
//         </Typography>
//         <Typography className="admin-login-subtitle" variant="h5" align="center" gutterBottom>
//           Admin Panel Login
//         </Typography>
//         <Typography className="admin-login-helper" variant="body2" align="center">
//           Authorized admins only
//         </Typography>

//         <form onSubmit={handleLogin}>
//           <TextField
//             fullWidth
//             label="Username"
//             name="username"
//             margin="normal"
//             className="admin-login-input"
//             value={admin.username}
//             onChange={handleChange}
//             required
//           />
//           <TextField
//             fullWidth
//             label="Password"
//             name="password"
//             type="password"
//             margin="normal"
//             className="admin-login-input"
//             value={admin.password}
//             onChange={handleChange}
//             required
//           />
//           <Button fullWidth type="submit" variant="contained" className="admin-login-btn" sx={{ mt: 2 }}>
//             Login
//           </Button>
//         </form>
//       </Paper>
//     </Box>
//   );
// };

// export default AdminLogin;

import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./Adminlogin.css";

const AdminLogin = () => {
  const [admin, setAdmin] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const { username, password } = admin;

    // Hardcoded admin login
    if (username === "admin" && password === "admin123") {
      localStorage.setItem("isAdmin", true);
      navigate("/admin/orders");
    } else {
      Swal.fire({
        toast: true,
        position: 'top',
        icon: 'warning',
        title: 'Invalid Admin Credentials',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });
    }
  };

  return (
    <Box className="admin-login-page-root">
      {/* Background soft modern blurs */}
      <span className="admin-login-glow admin-login-glow-left" aria-hidden="true" />
      <span className="admin-login-glow admin-login-glow-right" aria-hidden="true" />

      {/* Main Login Card Wrapper */}
      <Paper elevation={0} className="admin-login-card">
        <Typography className="admin-login-brand" component="h1">
          SudoCart
        </Typography>
        <Typography className="admin-login-subtitle" variant="h5" align="center" gutterBottom>
          Admin Panel Login
        </Typography>
        <Typography className="admin-login-helper" variant="body2" align="center">
          Authorized admins only
        </Typography>

        <form onSubmit={handleLogin} style={{ width: '100%', marginTop: '8px' }}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            margin="normal"
            className="admin-login-input"
            value={admin.username}
            onChange={handleChange}
            required
            autoComplete="username"
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            margin="normal"
            className="admin-login-input"
            value={admin.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
          <Button 
            fullWidth 
            type="submit" 
            variant="contained" 
            className="admin-login-btn" 
            sx={{ mt: 3, mb: 1 }}
          >
            Login to Dashboard
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default AdminLogin;
