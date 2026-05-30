

import {
    Box,
    Button,
    Link,
    Paper,
    TextField,
    Typography,
} from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { loginUser } from '../service/api';
import './Loginpage.css';

const LoginForm = ({ setLoggedInUser }) => {
  const [data, setData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const onChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(data);
      if (res.status === 200) {
        // Success toast
        Swal.fire({
          toast: true,
          position: 'top',
          icon: 'success',
          title: res.data.message,
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });

        setLoggedInUser(res.data.user);
        // Save user data with JWT token
        localStorage.setItem('loggedInUser', JSON.stringify({ 
          user: res.data.user,
          token: res.data.token 
        }));
        
        // Navigate based on user role
        if (res.data.user.role === 'seller') {
          navigate('/seller/dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || 'Something went wrong', 'error');
    }
  };

  return (
    <Box className="login-page-root">
      <span className="login-page-glow login-page-glow-left" aria-hidden="true" />
      <span className="login-page-glow login-page-glow-right" aria-hidden="true" />

      <Paper elevation={0} className="login-card">
        <Typography className="login-brand" component="h1">
          SudoCart
        </Typography>
        <Typography className="login-subtitle" variant="h5" align="center" gutterBottom>
          Welcome Back
        </Typography>
        <Typography className="login-helper" variant="body2" align="center">
          Login to continue shopping
        </Typography>

        <form onSubmit={submit}>
          <TextField
            label="Email or Mobile"
            name="username"
            variant="outlined"
            fullWidth
            margin="normal"
            className="login-input"
            value={data.username}
            onChange={onChange}
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            className="login-input"
            value={data.password}
            onChange={onChange}
            required
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            className="login-btn"
            sx={{ marginTop: 2 }}
          >
            Login
          </Button>
        </form>

        <Typography className="login-register-text" variant="body2" align="center" mt={2}>
          Don&apos;t have an account?{' '}
          <Link component={RouterLink} to="/register" underline="hover" className="login-register-link">
            Register
          </Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default LoginForm;
