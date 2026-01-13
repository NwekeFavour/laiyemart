import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Paper, CircularProgress, Alert } from '@mui/material';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            // 1. Attempt to parse JSON. Use a fallback if the server sends non-JSON error pages.
            const data = await response.json().catch(() => ({}));

            // 2. The Guard Clause: If response is 400 or 500, stop here.
            if (!response.ok) {
                const errorMsg = data.message || "Something went wrong. Please try again.";
                setError(errorMsg); // Set local state for UI alerts
                toast.error(errorMsg);
                setTimeout(() => {
                    setError(null)
                }, 7000)
                return; // CRITICAL: Stop the function from reaching the success logic below
            }

            // 3. Success Logic
            const successMsg = "A reset link has been sent to your email address.";
            setMessage(successMsg);
            toast.success(successMsg);
            setEmail('');

        } catch (err) {
            // 4. Handle Network Errors (Server down, No internet)
            console.error("Forgot Password Error:", err);
            const networkError = "Cannot connect to server. Please check your internet.";
            setError(networkError);
            setTimeout(() => {
                setError(null)
            }, 7000)
            toast.error(networkError);
        } finally {
            setLoading(false);
        }
    };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        bgcolor: '#f9fafb',
        px: 2 
      }}
    >
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          maxWidth: 400, 
          width: '100%', 
          borderRadius: 3, 
          border: '1px solid #e5e7eb',
          textAlign: 'center'
        }}
      >
        <Typography variant="h5" fontWeight="800" gutterBottom sx={{ letterSpacing: '-0.5px' }}>
          Forgot Password?
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Enter the email address associated with your account and we'll send you a link to reset your password.
        </Typography>

        {message && <Alert className='text-start!' severity="success" sx={{ mb: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email Address"
            variant="outlined"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            // Use sx to target the nested MUI elements accurately
            sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                '&:hover fieldset': {
                    borderColor: '#0f172a', // slate-900 on hover
                },
                '&.Mui-focused fieldset': {
                    borderColor: '#0f172a', // slate-900 on focus
                    borderWidth: '1.5px'
                },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                color: '#0f172a', // label color on focus
                }
            }}
            />

          <Button
            fullWidth
            className='bg-slate-900/90!'
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{ 
              color: '#fff', 
              py: 1.5, 
              fontWeight: 'bold',
              '&:hover': { bgcolor: '#333' } 
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Send Reset Link"}
          </Button>
        </form>

        <Box sx={{ mt: 3 }}>
          <Typography variant="body2">
            Remembered your password?{' '}
            <Link to="/auth/sign-in" className=' text-slate-800' style={{  fontWeight: 'bold', textDecoration: 'none' }}>
              Back to Login
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default ForgotPassword;