import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    Link,
    Paper,
    Radio,
    RadioGroup,
    TextField,
    Typography
} from "@mui/material";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { addUser } from "../service/api"; 
import './RegisterForm.css'; // Sahi CSS path ensure karein

function RegisterForm() {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
    dob: '',
    gender: '',
    role: 'user'  
  });

  const onChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const mobileRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    if (!mobileRegex.test(user.mobile)) {
      return Swal.fire("Invalid Mobile", "Mobile number must be exactly 10 digits.", "error");
    }

    if (!emailRegex.test(user.email)) {
      return Swal.fire("Invalid Email", "Please enter a valid email address.", "error");
    }

    if (!passwordRegex.test(user.password)) {
      return Swal.fire("Weak Password", "Password must be at least 8 characters and include an uppercase letter, a number, and a special character.", "error");
    }

    if (user.password !== user.confirmPassword) {
      return Swal.fire("Error", "Passwords do not match", "error");
    }

    try {
      const res = await addUser(user);
      if (res.status === 201) {
        Swal.fire("Success", res.data.message || "Registration Successful", "success");
        navigate('/login');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Something went wrong";
      Swal.fire("Error", errorMsg, "error");
    }
  };

  return (
    <Box className="reg-page-root">
      {/* Background Soft Blobs */}
      <div className="reg-bg-blob blob-1" aria-hidden="true" />
      <div className="reg-bg-blob blob-2" aria-hidden="true" />

      <Paper elevation={0} className="reg-card">
        <Box className="reg-header">
          <Typography variant="h4" className="reg-brand">
            SudoCart
          </Typography>
          <Typography variant="h5" className="reg-subtitle">
            Create Account
          </Typography>
          <Typography variant="body2" className="reg-helper">
            Join us to get the best shopping experience
          </Typography>
        </Box>

        <form onSubmit={handleSubmit} className="reg-form">
          <TextField
            label="Full Name"
            name="name"
            variant="outlined"
            fullWidth
            className="reg-input"
            onChange={onChange}
            required
          />
          
          <Box className="reg-row-2">
            <TextField
              label="Mobile"
              name="mobile"
              variant="outlined"
              fullWidth
              className="reg-input"
              onChange={onChange}
              required
            />
            <TextField
              label="Email"
              name="email"
              variant="outlined"
              fullWidth
              className="reg-input"
              onChange={onChange}
              required
            />
          </Box>

          <FormControl component="fieldset" className="reg-radio-group" fullWidth>
            <FormLabel component="legend" className="reg-radio-label">
              Gender
            </FormLabel>
            <RadioGroup
              row
              name="gender"
              value={user.gender}
              onChange={onChange}
              required
            >
              <FormControlLabel value="male" control={<Radio sx={{ color: '#111', '&.Mui-checked': { color: '#111' } }} />} label="Male" />
              <FormControlLabel value="female" control={<Radio sx={{ color: '#111', '&.Mui-checked': { color: '#111' } }} />} label="Female" />
              <FormControlLabel value="other" control={<Radio sx={{ color: '#111', '&.Mui-checked': { color: '#111' } }} />} label="Other" />
            </RadioGroup>
          </FormControl>

          <TextField
            type="date"
            name="dob"
            variant="outlined"
            fullWidth
            className="reg-input"
            onChange={onChange}
            InputLabelProps={{ shrink: true }}
            label="Date of Birth"
            required
          />

          <TextField
            label="Local Area / Address Line"
            name="addressLine"
            variant="outlined"
            fullWidth
            className="reg-input"
            onChange={onChange}
            required
          />

          <Box className="reg-row-3">
            <TextField
              label="City"
              name="city"
              variant="outlined"
              fullWidth
              className="reg-input"
              onChange={onChange}
              required
            />
            <TextField
              label="State"
              name="state"
              variant="outlined"
              fullWidth
              className="reg-input"
              onChange={onChange}
              required
            />
            <TextField
              label="Pincode"
              name="pincode"
              variant="outlined"
              fullWidth
              className="reg-input"
              onChange={onChange}
              required
            />
          </Box>

          <Box className="reg-row-2">
            <TextField
              type="password"
              label="Password"
              name="password"
              variant="outlined"
              fullWidth
              className="reg-input"
              onChange={onChange}
              required
            />
            <TextField
              type="password"
              label="Confirm Password"
              name="confirmPassword"
              variant="outlined"
              fullWidth
              className="reg-input"
              onChange={onChange}
              required
            />
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="reg-btn"
            disableElevation
          >
            Register
          </Button>
        </form>

        <Typography className="reg-login-text" variant="body2" align="center">
          Already have an account?{" "}
          <Link component={RouterLink} to="/login" underline="none" className="reg-login-link">
            Login
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
}

export default RegisterForm;