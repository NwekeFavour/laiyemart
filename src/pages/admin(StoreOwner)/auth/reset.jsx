import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  Button,
  Alert,
  IconButton,
  Stack,
} from "@mui/joy";
import { Lock, Eye, EyeOff, CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function ResetPasswordPage({ isDark }) {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  // Slate Theme Colors (Matching your AuthPage)
  const colors = {
    bg: isDark ? "#020617" : "#f8fafc",
    card: isDark ? "#0f172a" : "#ffffff",
    border: isDark ? "#334155" : "#e2e8f0",
    textMuted: isDark ? "#94a3b8" : "#64748b",
    primary: isDark ? "#f8fafc" : "#0f172a", 
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/customers/reset-password/${token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }), 
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset failed");

      setIsSuccess(true);
      toast.success("Password updated successfully!");
      setTimeout(() => navigate("/login"), 4000);
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: colors.bg, p: 2 }}>
        <Card sx={{ width: "100%", maxWidth: 420, borderRadius: "24px", p: 4, textAlign: "center", bgcolor: colors.card, border: "1px solid", borderColor: colors.border }}>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'center' }}>
             <CheckCircle size={56} color="#22c55e" />
          </Box>
          <Typography level="h3" sx={{ fontWeight: 800, color: colors.primary }}>Success!</Typography>
          <Typography sx={{ color: colors.textMuted, mt: 1, mb: 3 }}>
            Your password has been changed. You will be redirected to the login page shortly.
          </Typography>
          <Button 
            variant="solid" 
            onClick={() => navigate("/login")}
            sx={{ bgcolor: colors.primary, color: isDark ? "#0f172a" : "#fff", borderRadius: "12px", fontWeight: 700 }}
          >
            Go to Login
          </Button>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: colors.bg, p: 2 }}>
      <Card sx={{ width: "100%", maxWidth: 420, borderRadius: "24px", p: 3, bgcolor: colors.card, border: "1px solid", borderColor: colors.border, boxShadow: isDark ? "0 20px 25px -5px rgba(0,0,0,0.5)" : "xl" }}>
        
        {/* Header Section */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
           <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-md bg-red-500" />
            <Typography sx={{ fontWeight: 800, fontSize: "22px", color: colors.primary, letterSpacing: "-0.02em" }}>
              LAYE<span style={{ color: "#ef4444" }}>MART</span>
            </Typography>
          </div>
          <Typography sx={{ color: colors.textMuted, fontSize: "14px" }}>
            Set your new secure password
          </Typography>
        </Box>

        {error && (
          <Alert color="danger" variant="soft" sx={{ mb: 2, borderRadius: "12px" }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleReset}>
          <Stack spacing={2.5}>
            {/* New Password */}
            <Box>
              <Typography level="body-sm" sx={{ mb: 0.8, fontWeight: 600, color: colors.textMuted }}>
                New Password
              </Typography>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full block bg-white text-slate-900 text-sm py-3 pl-11 pr-11 border border-slate-200 rounded-xl outline-none focus:border-slate-500 focus:ring-4 focus:ring-slate-400/15 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </Box>

            {/* Confirm Password */}
            <Box>
              <Typography level="body-sm" sx={{ mb: 0.8, fontWeight: 600, color: colors.textMuted }}>
                Confirm Password
              </Typography>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full block bg-white text-slate-900 text-sm py-3 pl-11 pr-4 border border-slate-200 rounded-xl outline-none focus:border-slate-500 focus:ring-4 focus:ring-slate-400/15 transition-all"
                />
              </div>
            </Box>

            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              endDecorator={!loading && <ArrowRight size={18} />}
              sx={{
                borderRadius: "12px",
                py: 1.5,
                fontWeight: 700,
                bgcolor: colors.primary,
                color: isDark ? "#0f172a" : "#ffffff",
                "&:hover": { bgcolor: isDark ? "#e2e8f0" : "#1e293b" },
              }}
            >
              Update Password
            </Button>
          </Stack>
        </form>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Button
            component={Link}
            to="/login"
            variant="plain"
            startDecorator={<ArrowLeft size={16} />}
            sx={{ color: colors.textMuted, fontSize: "14px", "&:hover": { bgcolor: "transparent", textDecoration: "underline neutral.900"} }}
          >
            Back to Login
          </Button>
        </Box>
      </Card>
    </Box>
  );
}