import { Box, Paper, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './RegisterChoice.css';

function RegisterChoice() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ffe680 0%, #fff 100%)',
        padding: '20px'
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: '40px',
          maxWidth: '600px',
          width: '100%',
          textAlign: 'center',
          borderRadius: '15px',
          border: '3px solid #000'
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            marginBottom: '10px',
            color: '#000'
          }}
        >
          Welcome! 🎉
        </Typography>
        <Typography
          variant="body1"
          sx={{
            marginBottom: '40px',
            color: '#666',
            fontSize: '16px'
          }}
        >
          Choose how you want to register
        </Typography>

        <div className="choice-container">
          <div
            className="choice-card user-card"
            onClick={() => navigate('/register/user')}
          >
            <div className="choice-icon">👤</div>
            <h3>Register as User</h3>
            <p>Shop products, add to cart, and enjoy seamless shopping experience</p>
            <button className="choice-btn">Continue as User</button>
          </div>

          <div
            className="choice-card seller-card"
            onClick={() => navigate('/register/seller')}
          >
            <div className="choice-icon">🏪</div>
            <h3>Register as Seller</h3>
            <p>Sell your products, manage inventory, and grow your business</p>
            <button className="choice-btn">Continue as Seller</button>
          </div>
        </div>

        <Typography
          sx={{
            marginTop: '30px',
            color: '#666',
            fontSize: '14px'
          }}
        >
          Already have an account?{' '}
          <a
            href="/login"
            style={{
              color: '#000',
              fontWeight: 'bold',
              textDecoration: 'none'
            }}
          >
            Login here
          </a>
        </Typography>
      </Paper>
    </Box>
  );
}

export default RegisterChoice;
