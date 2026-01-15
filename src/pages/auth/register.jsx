import React, { useState } from 'react';
import { Mail, Lock, User, Store, ArrowRight, CheckCircle2, Eye, EyeOff, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { registerStoreOwner, verifyOTP } from '../../../services/authService'; // Ensure verifyOTP is exported from your service

export default function SignUpPage() {
    // 1. New State Management
    const [step, setStep] = useState(1); 
    const [otp, setOtp] = useState("");
    
    const [showPassword, setShowPassword] = useState(false);
    const [fullName, setFullName] = useState("");
    const [storeName, setStoreName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
  const [resendTimer, setResendTimer] = useState(0);

  const startResendTimer = () => {
    setResendTimer(30); // 30 seconds cooldown
  };

  React.useEffect(() => {
    if (resendTimer === 0) return; // nothing to do if timer is 0

    const interval = setInterval(() => {
      setResendTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval); // cleanup
  }, [resendTimer]);

    const handleResendOtp = async () => {
      if (resendTimer > 0) return;

      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/resend-otp`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        alert(data.message);
        startResendTimer(); // start 30s countdown
      } catch (err) {
        alert(err.message);
      } finally {
      }
    };

    // 2. Step 2 Handler: OTP Verification
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await verifyOTP({
                email,
                otp,
            });
            // On success, go to sign-in or dashboard
            navigate("/auth/sign-in");
        } catch (err) {
            setError(err?.message || "Invalid OTP code.");
            setTimeout(() => setError(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    const getStrength = (pass) => {
        let score = 0;
        if (pass.length > 7) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;
        return score;
    };
    return (
        <div className="min-h-screen bg-[#f3f4ff] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Blobs - Unchanged */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200 blur-[100px] opacity-60"></div>
            <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[40%] rounded-full bg-indigo-200 blur-[120px] opacity-70"></div>

            <div className="max-w-5xl w-full grid lg:grid-cols-2 bg-white rounded-[32px] shadow-2xl overflow-hidden z-10">
                
                {/* Left Side: Marketing/Value Prop - Logic added to headline */}
                <div className="hidden lg:flex flex-col justify-center p-12 bg-slate-900 text-white relative">
                    <div className="absolute top-8 left-8 flex items-center gap-2">
                        <div className="w-8 h-8 rounded-md bg-red-500" />
                        <span className="font-bold tracking-tight text-lg text">LAYEMART</span>
                    </div>

                    <h2 className="text-4xl font-bold leading-tight mb-6">
                        {step === 1 ? "Start your journey to " : "Almost there! Verify your "}
                        <span className="text-blue-400">{step === 1 ? "financial freedom" : "account"}</span> today.
                    </h2>

                    <div className="space-y-6">
                        {["14-day free trial, no credit card required", "Set up your store in less than 5 minutes", "Integrated local payment gateways"].map((text, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <CheckCircle2 className="text-emerald-400" size={20} />
                                <p className="text-slate-300 font-medium">{text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Sign Up Form */}
                <div className="p-8 lg:p-12 flex flex-col justify-center">
                    
                    {step === 1 ? (
                        /* --- STEP 1: REGISTRATION FORM --- */
                        <>
                            <div className="mb-8">
                                <h1 className="text-2xl font-extrabold text-slate-900">Create your store account</h1>
                                <div className="flex flex-wrap md:mt-0 mt-2 items-center gap-2 mt-1">
                                    <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-blue-100">
                                        Early Access
                                    </span>
                                    <p className="text-slate-500 text-sm">Be among the first to build with Layemart.</p>
                                </div>
                            </div>

                            <form
                                className="space-y-4"
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    setLoading(true);
                                    try {
                                        await registerStoreOwner({
                                            fullName,
                                            email,
                                            password,
                                            storeName,
                                            subdomain: storeName.toLowerCase().replace(/\s+/g, "-"),
                                        });
                                        setStep(2); // Move to OTP step
                                    } catch (err) {
                                        setError(err?.message === "Failed to fetch" ? "Network error: Unable to reach the server." : err.message);
                                        setTimeout(() => setError(null), 3000);
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                            >
                                {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm mb-2">{error}</div>}

                                <div className='grid grid-cols-2 space-x-4'>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[13px] font-semibold text-slate-600 ml-0.5">Full Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-500" size={18} />
                                            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" className="w-full py-3 pl-11 pr-4 border border-slate-200 rounded-xl outline-none focus:border-slate-500 focus:ring-4 focus:ring-slate-400/15 transition-all" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-[13px] font-semibold text-slate-600 ml-0.5">Store Name</label>
                                        <div className="relative group">
                                            <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-500" size={18} />
                                            <input type="text" placeholder="My Amazing Store" value={storeName} onChange={(e) => setStoreName(e.target.value)} className="w-full py-3 pl-11 pr-4 border border-slate-200 rounded-xl outline-none focus:border-slate-500 focus:ring-4 focus:ring-slate-400/15 transition-all" />
                                        </div>
                                        <p className="text-[11px] text-slate-400 mt-1 ml-1">
                                          Your store will be live at:
                                          <span className="text-blue-600 font-medium lowercase">
                                            {" "}{storeName ? storeName.replace(/\s+/g, '-').toLowerCase() : "your-store"}.layemart.shop
                                          </span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[13px] font-semibold text-slate-600 ml-0.5">Email Address</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input type="email" placeholder="name@company.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full py-3 pl-11 pr-4 border border-slate-200 rounded-xl outline-none focus:border-slate-500 transition-all" />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[13px] font-semibold text-slate-600 ml-0.5">Password</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input 
                                            type={showPassword ? "text" : "password"} 
                                            value={password} 
                                            required
                                            onChange={(e) => setPassword(e.target.value)} 
                                            placeholder="••••••••" 
                                            className={`w-full py-3 pl-11 pr-11 border rounded-xl outline-none transition-all ${
                                                password ? (getStrength(password) < 3 ? 'border-orange-300 focus:border-orange-500' : 'border-green-300 focus:border-green-500') : 'border-slate-200 focus:border-slate-500'
                                            }`} 
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>

                                    {/* --- PASSWORD STRENGTH DISCLAIMER BANNER --- */}
                                    {password.length > 0 && (
                                        <div className={`mt-2 p-3 rounded-xl border transition-all ${getStrength(password) < 3 ? 'bg-orange-50 border-orange-100' : 'bg-green-50 border-green-100'}`}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4].map((s) => (
                                                        <div key={s} className={`h-1.5 w-6 rounded-full ${s <= getStrength(password) ? (getStrength(password) < 3 ? 'bg-orange-400' : 'bg-green-500') : 'bg-slate-200'}`} />
                                                    ))}
                                                </div>
                                                <span className={`text-[10px] font-bold uppercase tracking-wider ${getStrength(password) < 3 ? 'text-orange-700' : 'text-green-700'}`}>
                                                    {getStrength(password) < 3 ? "Weak" : "Secure"}
                                                </span>
                                            </div>
                                            <ul className="text-[11px] space-y-1 text-slate-500 font-medium">
                                                <li className="flex items-center gap-1.5">
                                                    <div className={`w-1 h-1 rounded-full ${password.length >= 8 ? 'bg-green-500' : 'bg-slate-300'}`} />
                                                    At least 8 characters
                                                </li>
                                                <li className="flex items-center gap-1.5">
                                                    <div className={`w-1 h-1 rounded-full ${/[0-9!@#$%^&*]/.test(password) ? 'bg-green-500' : 'bg-slate-300'}`} />
                                                    Include a number or special character
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <button disabled={loading} className="w-full mt-4 bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 group disabled:opacity-60">
                                    {loading ? "Processing..." : "Start My 14-Day Free Trial"}
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>
                            <p className="text-end text-sm text-slate-500 mt-4">
                            Already have an account?{" "}
                            <span
                                onClick={() => navigate("/auth/sign-in")}
                                className="text-slate-600 font-semibold cursor-pointer hover:underline"
                            >
                                Sign In
                            </span>
                            </p>
                        </>
                    ) : (
                        /* --- STEP 2: OTP VERIFICATION FORM --- */
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <button onClick={() => setStep(1)} className="flex items-center gap-2 text-slate-400 hover:text-slate-600 mb-6 text-sm font-medium">
                                <ArrowLeft size={16} /> Back to details
                            </button>

                            <div className="mb-8">
                                <h1 className="text-2xl font-extrabold text-slate-900">Check your email</h1>
                                <p className="text-slate-500 text-sm mt-1">
                                    We've sent a 6-digit verification code to <span className="font-semibold text-slate-900">{email}</span>
                                </p>
                            </div>

                            <form className="space-y-6" onSubmit={handleVerifyOtp}>
                                {error && <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm">{error}</div>}

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-[13px] font-semibold text-slate-600 ml-0.5">Verification Code</label>
                                    <div className="relative group">
                                        <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input 
                                            type="text" 
                                            maxLength={6}
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                                            placeholder="000000" 
                                            className="w-full py-4 pl-11 pr-4 border border-slate-200 rounded-xl outline-none focus:border-slate-500 focus:ring-4 focus:ring-slate-400/15 transition-all text-2xl tracking-[0.5em] font-bold"
                                        />
                                    </div>
                                </div>

                                <button disabled={loading || otp.length < 6} className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 disabled:opacity-60">
                                    {loading ? "Verifying..." : "Verify & Start Trial"}
                                    <ArrowRight size={18} />
                                </button>
                            </form>

                            <p className="text-end text-sm text-slate-500 mt-3">
                              Didn't receive the code?{" "}
                              <button
                                type="button"
                                onClick={handleResendOtp}
                                className={`text-slate-900 font-bold hover:underline underline-offset-4 ${resendTimer > 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                                disabled={resendTimer > 0}
                                >
                                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend"}
                              </button>
                            </p>
                        </div>
                    )}

                    {/* Footer disclaimer stays at the bottom */}
                    <p className="text-center text-xs text-slate-400 mt-6 px-6">
                        By clicking the button above, you agree to our 
                        <span className="text-slate-600 font-semibold cursor-pointer"> Terms of Service </span> 
                        and <span className="text-slate-600 font-semibold cursor-pointer"> Privacy Policy</span>.
                    </p>
                </div>
            </div>
        </div>
    );
}