import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  Typography,
  Divider,
  Card,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Checkbox,
  IconButton,
  Alert,
} from "@mui/joy";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Store,
  User,
  Github,
  ArrowLeft,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  forgotPasswordCustomer,
  loginCustomer,
} from "../../../../services/customerService";
import { getSubdomain } from "../../../../storeResolver";
import { toast } from "react-toastify";

export default function AuthPage({ isDark, storeSlug, isStarter, storeData }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  // Slate Theme Colors
  const colors = {
    bg: isDark ? "#020617" : "#f8fafc",
    card: isDark ? "#0f172a" : "#ffffff",
    input: isDark ? "#1e293b" : "#f1f5f9",
    border: isDark ? "#334155" : "#e2e8f0",
    textMuted: isDark ? "#94a3b8" : "#64748b",
    primary: isDark ? "#f8fafc" : "#0f172a", // High contrast slate
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };



    const getStorePath = (path) => {
    return isStarter ? `/${storeSlug}${path}` : path;
  };

  
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);


    try {
      await loginCustomer({
        email: formData.email,
        password: formData.password,
        // Even though your service doesn't take storeSlug yet,
        // we'll pass it to be safe for multi-tenant logic
        storeSlug
      });

      // Redirect to store home on success
      toast.success("Logged In Successfully", {
        containerId: "STOREFRONT",
      });
      setTimeout(() => {
        navigate(getStorePath(`/`));
      }, 4000);
    } catch (err) {
      toast.error(err.message, {
        containerId: "STOREFRONT",
      });
      setTimeout(() => {
        setError(err.message || "Invalid email or password");
      }, 2000);
      setTimeout(() => setError(null), 7000);
    } finally {
      setError("");
      setLoading(false);
    }
  };


  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!formData.email?.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await forgotPasswordCustomer({
        email: formData.email.trim(),
        storeSlug
      });

      toast.success("Reset link sent to your email!", {
        containerId: "STOREFRONT",
      });
      setFormData({ email: "" });

      setIsForgotMode(false);
    } catch (err) {
      // Axios-style error
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Unable to send reset link. Please try again.";

      setError(message);

      toast.error(message, {
        containerId: "STOREFRONT",
      });
    } finally {
      setLoading(false);
    }
  };



  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: colors.bg,
        p: 2,
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 420,
          borderRadius: "24px",
          p: 3,
          bgcolor: colors.card,
          border: "1px solid",
          borderColor: colors.border,
          boxShadow: isDark ? "0 20px 25px -5px rgba(0,0,0,0.5)" : "xl",
        }}
      >
        {/* Logo Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
           <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
              Welcome back!
            </h2>
          <div onClick={() => navigate(getStorePath("/"))} className="flex items-center gap-3 justify-start w-full cursor-pointer">
            {/* LOGO SECTION */}
            <div  className="relative cursor-pointer">
              {storeData?.logo?.url ? (
                <img
                  src={storeData.logo.url}
                  alt={storeData.name}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                />
              ) : (
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm"
                  style={{
                    background:
                      "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)",
                  }}
                >
                  <span className="text-white font-bold text-xl">
                    {storeData?.name?.charAt(0).toUpperCase() || "S"}
                  </span>
                </div>
              )}

              {/* Status Indicator (Green dot if Onboarded/Verified) */}
              {storeData?.paystack?.verified && (
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-[#0f172a] rounded-full" />
              )}
            </div>

            {/* NAME & PLAN SECTION */}
            <div className="flex flex-col justify-center">
              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "15px", lg: "18px" },
                  color: isDark ? "white" : "neutral.900",
                  letterSpacing: "-0.03em",
                  lineHeight: 1,
                  textTransform: "uppercase",
                }}
              >
                {storeData?.name || "My Store"}
              </Typography>

              <Typography
                level="body-xs"
                sx={{
                  mt: 0.5,
                  fontWeight: 600,
                  color: "neutral.500",
                  fontSize: "10px",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                {storeData?.plan || "Starter"} Plan
              </Typography>
            </div>
          </div>          
        </Box>

        <Tabs defaultValue={0} sx={{ bgcolor: "transparent" }}>
          {[0].map((value) => (
            <TabPanel key={value} value={value} sx={{ p: 0, mt: 1 }}>
              {error && (
                <Alert
                  color="danger"
                  variant="soft"
                  sx={{ mb: 2, borderRadius: "12px" }}
                >
                  {error}
                </Alert>
              )}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                  <Typography
                    level="body-sm"
                    sx={{ mb: 0.8, fontWeight: 600, color: colors.textMuted }}
                  >
                    Email
                  </Typography>
                  <div className="relative group">
                    {/* Icon Layer */}
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail
                        size={18}
                        className="text-slate-400 group-focus-within:text-slate-500 transition-colors"
                      />
                    </div>

                    {/* Standard Input */}
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@company.com"
                      className="
                            w-full block bg-white text-slate-900 text-sm py-3 pl-11 pr-4
                            border border-slate-200 rounded-xl
                            placeholder:text-slate-400
                            transition-all duration-200
                            outline-none
                            /* This is the magic part: Slate focus instead of blue */
                            focus:border-slate-500 
                            focus:ring-4 
                            focus:ring-slate-400/20
                        "
                    />
                  </div>
                </Box>

                {/* CONDITIONAL PASSWORD FIELD */}
                {!isForgotMode && (
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 0.8,
                      }}
                    >
                      <Typography
                        level="body-sm"
                        sx={{ fontWeight: 600, color: colors.textMuted }}
                      >
                        Password
                      </Typography>
                      <Typography
                        onClick={() => setIsForgotMode(true)} // 👈 Switch to forgot mode
                        sx={{
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#ef4444",
                          cursor: "pointer",
                          "&:hover": { textDecoration: "underline neutral.900"},
                        }}
                      >
                        Forgot?
                      </Typography>
                    </Box>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Lock size={18} className="text-slate-400" />
                      </div>
                      <input
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="w-full block bg-white text-slate-900 text-sm py-3 pl-11 pr-11 border border-slate-200 rounded-xl outline-none focus:border-slate-500 focus:ring-4 focus:ring-slate-400/15"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </Box>
                )}

                {!isForgotMode && (
                  <Checkbox
                    label="Remember this device"
                    size="sm"
                    sx={{ color: colors.textMuted }}
                  />
                )}

                <Button
                  fullWidth
                  size="lg"
                  loading={loading} // 👈 Add loading state
                  onClick={isForgotMode ? handleForgotPassword : handleLogin} // 👈 Add click handler
                  endDecorator={!loading && <ArrowRight size={18} />}
                  sx={{
                    borderRadius: "12px",
                    mt: 1,
                    py: 1.5,
                    fontWeight: 700,
                    bgcolor: colors.primary,
                    color: isDark ? "#0f172a" : "#ffffff",
                    "&:hover": { bgcolor: isDark ? "#e2e8f0" : "#1e293b" },
                  }}
                >
                  {isForgotMode ? "Send Reset Link" : "Sign In to Shop"}
                </Button>
              </Box>
            </TabPanel>
          ))}
        </Tabs>

        {isForgotMode && (
          <Button
            variant="plain"
            startDecorator={<ArrowLeft size={16} />}
            onClick={() => setIsForgotMode(false)}
            sx={{
              color: colors.textMuted,
              fontSize: "14px",
              alignSelf: "center",
            }}
          >
            Back to Login
          </Button>
        )}

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography sx={{ fontSize: "14px", color: colors.textMuted }}>
            Don't have an account?{" "}
            <Link
              className="text-[#64748b] hover:text-[#0f172a] hover:underline"
              to={getStorePath(`/register`)}
            >
              Create Account
            </Link>
          </Typography>
        </Box>
      </Card>
    </Box>
  );
}
