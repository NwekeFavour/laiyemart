import React, { useEffect, useState } from 'react';
import { Button, Input, Checkbox, Typography, Divider, Box, Sheet, IconButton } from '@mui/joy';
import { Mail, Lock, Eye, EyeOff, Chrome, Github, MailCheck } from 'lucide-react';
import { Google } from '@mui/icons-material';
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from '../../store/useAuthStore';
import { loginStoreOwner } from '../../../services/authService';
import { toast } from 'react-toastify';
import { CircularProgress } from '@mui/material';
export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState("");
    const navigate = useNavigate();


    useEffect(() => {
        if(localStorage.getItem("layemart-auth")){
            navigate("/auth/redirect")
        }
    }, []);
    return (
        <Box 
        sx={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            bgcolor: '#f3f4ff', // Matches Hero background
            position: 'relative',
            overflow: 'hidden',
            px: 2
        }}
        >
        {/* Decorative Background Blobs from Hero */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200 blur-[100px] opacity-60"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[40%] rounded-full bg-indigo-200 blur-[120px] opacity-70"></div>

        <Sheet
            variant="white"
            sx={{
            width: 400,
            p: 4,
            borderRadius: '24px', // Extra rounded for premium feel
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            zIndex: 10,
            }}
        >
            {/* Logo Section */}
            <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                <div className="w-8 h-8 rounded-md bg-red-500" />
                <Typography className="text" sx={{ fontWeight: 800, fontSize: '18px', letterSpacing: '-0.02em', color: '#0f172a' }}>
                LAYEMART
                </Typography>
            </Box>
            <Typography level="h4" component="h1" sx={{ fontWeight: 700 }}>
                Welcome back
            </Typography>
            <Typography level="body-sm" sx={{ color: 'neutral.500' }}>
                Enter your details to manage your store
            </Typography>
            </Box>

            {/* Social Login */}
            <Box sx={{ display: 'block', gap: 2}}>
            <Button 
                variant="outlined" 
                color="neutral" 
                fullWidth 
                startDecorator={<MailCheck size={18} />}
                sx={{ borderRadius: '12px', fontWeight: 600 }}
            >
                Continue with Email
            </Button>
            </Box>

            <Divider sx={{ my: 1 }}>
            <Typography level="body-xs" sx={{ textTransform: 'uppercase', fontWeight: 700, color: 'neutral.400' }}>
                or continue with
            </Typography>
            </Divider>

                {error && (
                <Typography level="body-sm" className="bg-red-500/20! p-2! rounded-md!" sx={{ color: 'red', mt: 1, textAlign: 'start' }}>
                    {error}
                </Typography>
                )}
            {/* Form Fields */}
            <form
            onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);
                setError(null);

                try {
                const data = await loginStoreOwner(email, password);

                if (!data?.user?.role) {
                    throw new Error("Invalid server response");
                }

                if (data.user.role === "SUPER_ADMIN") {
                    toast.success("Welcome back, Admin!");
                    navigate("/dashboard");
                } else if (data.user.role === "OWNER") {
                    toast.success("Logged in successfully!");
                    navigate("/dashboard/beta");
                } else {
                    throw new Error("Unauthorized role");
                }
                } catch (err) {
                let message = "Something went wrong. Please try again.";

                // 🔹 1. Server responded with error (4xx / 5xx)
                if (err.response) {
                    const { status, data } = err.response;

                    switch (status) {
                    case 400:
                        message = data?.message || "Invalid request.";
                        break;
                    case 401:
                        message = "Invalid email or password.";
                        break;
                    case 403:
                        message = "You are not authorized to access this account.";
                        break;
                    case 404:
                        message = "Login service not found.";
                        break;
                    case 500:
                        message = "Server error. Please try again later.";
                        break;
                    default:
                        message = data?.message || "Unexpected server error.";
                    }
                }

                // 🔹 2. Request made but no response (network / CORS / server down)
                else if (err.request) {
                    message = "Network error. Please check your internet connection.";
                }

                // 🔹 3. JS or unknown error
                else if (err.message) {
                    message = err.message;
                }

                setError(message);
                toast.error(message);
                console.error("Login Error:", err);

                // Auto-clear inline error
                setTimeout(() => setError(null), 5000);
                } finally {
                setLoading(false);
                }
            }}
            >
          
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                    <div className="flex flex-col gap-1.5 w-full">
                    {/* Standard Label */}
                    <label 
                        htmlFor="email" 
                        className="text-[13px] font-semibold! text-slate-600 ml-0.5"
                    >
                        Email Address
                    </label>

                    {/* Input Container */}
                    <div className="relative group">
                        {/* Icon Layer */}
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Mail size={18} className="text-slate-400 group-focus-within:text-slate-500 transition-colors" />
                        </div>

                        {/* Standard Input */}
                        <input
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
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
                    </div>

                    <Box>
                    <Typography level="body-sm" sx={{ mb: 1, fontWeight: 600, color: '#475569' }}>
                        Password
                    </Typography>
                        <div className="flex flex-col gap-1.5 w-full">
                        {/* Input Container */}
                            <div className="relative group">
                                {/* Start Icon (Lock) */}
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <Lock 
                                    size={18} 
                                    className="text-slate-400 group-focus-within:text-slate-500 transition-colors" 
                                />
                                </div>

                                {/* Standard Input */}
                                <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="
                                    w-full block bg-white text-slate-900 text-sm py-3 pl-11 pr-11
                                    border border-slate-200 rounded-xl
                                    placeholder:text-slate-400
                                    transition-all duration-200
                                    outline-none
                                    focus:border-slate-500 
                                    focus:ring-4 
                                    focus:ring-slate-400/15
                                "
                                />

                                {/* End Decorator (Eye Toggle) */}
                                <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                {showPassword ? (
                                    <EyeOff size={18} strokeWidth={2.5} />
                                ) : (
                                    <Eye size={18} strokeWidth={2.5} />
                                )}
                                </button>
                            </div>
                        </div>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Checkbox label="Remember me" size="sm" sx={{ fontWeight: 500 }} />
                    <Typography 
                        level="body-sm" 
                        sx={{ 
                        color: '#3b82f6', 
                        cursor: 'pointer',
                        '&:hover': { textDecoration: 'underline' } 
                        }}
                    >
                        <Link className='font-semibold!' to={"/auth/forgot-password"}>
                            Forgot password?
                        </Link>
                    </Typography>
                    </Box>

                    <Button
                    type="submit"
                    size="lg"
                    loading={loading}
                    disabled={loading}
                    sx={{
                        bgcolor: '#0f172a',
                        borderRadius: '12px',
                        py: 1.5,
                        fontWeight: 600,
                        mt: 1,
                        '&:hover': { bgcolor: '#1e293b' }
                    }}
                    >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In to Dashboard"}
                    </Button>
                </Box>
            </form>

            <Typography level="body-sm" sx={{ textAlign: 'center', mt: 1 }}>
            Don&apos;t have an account?{' '}
            <Typography 
                sx={{ 
                color: '#3b82f6', 
                fontWeight: 700, 
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' } 
                }}
            >
                <Link to="/auth/sign-up"> 
                    Create store
                </Link>
            </Typography>
            </Typography>
        </Sheet>
        </Box>
    );
}