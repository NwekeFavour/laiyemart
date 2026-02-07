import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button, Input, Typography, Box, Stack } from "@mui/joy";
import { toast } from "react-toastify";
import { loginCustomer, resendCustomerOTP, verifyCustomerOTP } from "../../../../services/customerService";

export default function VerifyOTP({storeSlug, isStarter}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [resendTimer, setResendTimer] = useState(0);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const email = location.state?.email;


  useEffect(() => {
  if (resendTimer > 0) {
    const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
    return () => clearTimeout(timer);
  }
}, [resendTimer]);
  // Security: If no email in state, send them back to register
  useEffect(() => {
    if (!email) {
      navigate(-1);
      toast.error("Session expired. Please register again.");
    }
  }, [email, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) return toast.error("Please enter a 6-digit code");
    
    setLoading(true);
    try {
      const data = await verifyCustomerOTP({
        email,
        otp,
        storeSlug
      });

      // ✅ Log into Zustand/Context
      loginCustomer({
        token: data.token,
        customer: data.customer,
        storeSlug
      });

      toast.success("Account verified successfully!", {containerId: "STOREFRONT"});
      navigate(isStarter ?`/${storeSlug}/` : `/`);
    } catch (err) {
      toast.error(err.message, {containerId: "STOREFRONT"});
    } finally {
      setLoading(false);
    }
  };


  const handleResend = async () => {
  if (resendTimer > 0) return;
  
  try {
    await resendCustomerOTP({ email, storeSlug });
    toast.info("New code sent!", {containerId: "STOREFRONT"});
    setResendTimer(60); // Lock button for 60 seconds
  } catch (err) {
    toast.error(err.message);
  }
};
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '80vh',
      px: 2 
    }}>
      <Stack spacing={2} sx={{ maxWidth: 400, width: '100%', textAlign: 'center' }}>
        <Typography level="h2" fontSize="xl2" fontWeight="xl">
          Check your email
        </Typography>
        <Typography level="body-md" sx={{ color: 'text.secondary', mb: 2 }}>
          We sent a 6-digit code to <br />
          <strong style={{ color: '#000' }}>{email}</strong>
        </Typography>

        <form onSubmit={handleVerify}>
          <Stack spacing={3}>
            <Input
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="0 0 0 0 0 0"
              slotProps={{
                input: {
                  style: {
                    textAlign: 'center',
                    letterSpacing: '1rem',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                  },
                },
              }}
              sx={{
                "--Input-radius": "12px",
                py: 1.5,
              }}
            />

            <Button
              type="submit"
              loading={loading}
              size="lg"
              sx={{
                bgcolor: 'black',
                color: 'white',
                '&:hover': { bgcolor: '#333' },
                borderRadius: 'lg',
                fontWeight: 700
              }}
            >
              Verify Account
            </Button>
          </Stack>
        </form>

        <Typography level="body-xs" sx={{ mt: 2 }}>
          Didn't receive the code? <br />
          <Button onClick={handleResend} variant="plain" color="neutral" sx={{ fontWeight: 700, textDecoration: 'underline' }}>
            Resend OTP
          </Button>
        </Typography>
      </Stack>
    </Box>
  );
}