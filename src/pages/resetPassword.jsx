import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Paper, Alert } from '@mui/material';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState({ type: '', msg: '' });

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setStatus({ type: 'error', msg: 'Passwords do not match' });
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setStatus({ type: 'success', msg: 'Password reset successful! Redirecting...' });
      toast.success(status.msg)
      setTimeout(() => navigate('/auth/sign-in'), 3000);
    } catch (err) {
      setStatus({ type: 'error', msg: err.message });
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f9fafb' }}>
      <Paper sx={{ p: 4, maxWidth: 400, width: '100%', borderRadius: 2, border: '1px solid #e5e7eb' }} elevation={0}>
        <Typography variant="h5" fontWeight="800" mb={1}>Set New Password</Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>Please enter your new secure password below.</Typography>

        {status.msg && <Alert severity={status.type} sx={{ mb: 2 }}>{status.msg}</Alert>}

        <form onSubmit={handleReset}>
          <TextField
            fullWidth label="New Password" type="password" required
            value={password} onChange={(e) => setPassword(e.target.value)}
            sx={inputStyle}
          />
          <TextField
            fullWidth label="Confirm New Password" type="password" required
            value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            sx={inputStyle}
          />
          <Button fullWidth type="submit" variant="contained" sx={btnStyle}>Reset Password</Button>
        </form>
      </Paper>
    </Box>
  );
};

// Styling variables to keep the Slate-900 look
const inputStyle = { mb: 2, '& .MuiOutlinedInput-root': { '&.Mui-focused fieldset': { borderColor: '#0f172a' } }, '& .MuiInputLabel-root.Mui-focused': { color: '#0f172a' } };
const btnStyle = { bgcolor: '#0f172a', py: 1.5, fontWeight: 'bold', '&:hover': { bgcolor: '#1e293b' } };

export default ResetPassword;