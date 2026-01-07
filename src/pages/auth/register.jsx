import React, { useState } from 'react';
import { Mail, Lock, User, Store, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { registerStoreOwner } from '../../../services/authService';

export default function SignUpPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [fullName, setFullName] = useState("");
    const [storeName, setStoreName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#f3f4ff] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200 blur-[100px] opacity-60"></div>
      <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[40%] rounded-full bg-indigo-200 blur-[120px] opacity-70"></div>

      <div className="max-w-5xl w-full grid lg:grid-cols-2 bg-white rounded-[32px] shadow-2xl overflow-hidden z-10">
        
        {/* Left Side: Marketing/Value Prop */}
        <div className="hidden lg:flex flex-col justify-center p-12 bg-slate-900 text-white relative">
          <div className="absolute top-8 left-8 flex items-center gap-2">
            <div className="w-8 h-8 rounded-md bg-red-500" />
            <span className="font-bold tracking-tight text-lg text">LAIYEMART</span>
          </div>

          <h2 className="text-4xl font-bold leading-tight mb-6">
            Start your journey to <span className="text-blue-400">financial freedom</span> today.
          </h2>

          <div className="space-y-6">
            {[
              "14-day free trial, no credit card required",
              "Set up your store in less than 5 minutes",
              "Integrated local payment gateways"
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="text-emerald-400" size={20} />
                <p className="text-slate-300 font-medium">{text}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-slate-800/50 rounded-2xl border border-slate-700">
            <p className="italic text-slate-400 text-sm">
              "Laiyemart changed the way I handle my boutique. The automated inventory saved me 10 hours a week!"
            </p>
            <p className="mt-4 font-bold text-sm">— Sarah J., Boutique Owner</p>
          </div>
        </div>

        {/* Right Side: Sign Up Form */}
        <div className="p-8 lg:p-12 flex flex-col justify-center">
            <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-slate-900">Create your store account</h1>
            <div className="flex flex-wrap md:mt-0 mt-2 items-center gap-2 mt-1">
                {/* Small badge to indicate early access */}
                <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-blue-100">
                Early Access
                </span>
                <p className="text-slate-500 text-sm">
                Be among the first to build with Laiyemart.
                </p>
            </div>
            </div>

          <form
            className="space-y-4"
            onSubmit={async (e) => {
                e.preventDefault();
                setLoading(true);

                try {
                await registerStoreOwner({
                    email,
                    password,
                    storeName,
                    subdomain: storeName.toLowerCase().replace(/\s+/g, "-"),
                });

                navigate("/auth/sign-in");
                } catch (err) {
                setError(
                    err?.message === "Failed to fetch"
                    ? "Network error: Unable to reach the server."
                    : err.message
                );

                setTimeout(() => setError(null), 3000);
                } finally {
                setLoading(false);
                }
            }}
            >
                {error && (
                <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm mb-2">
                    {error}
                </div>
                )}

            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-slate-600 ml-0.5">Full Name</label>
              <div className="relative group">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-500" size={18} />
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full py-3 pl-11 pr-4 border border-slate-200 rounded-xl outline-none focus:border-slate-500 focus:ring-4 focus:ring-slate-400/15 transition-all" 
                />
              </div>
            </div>

            {/* Store Name */}
            <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-semibold text-slate-600 ml-0.5">Store Name</label>
            <div className="relative group">
                <Store className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-500" size={18} />
                <input 
                type="text" 
                placeholder="My Amazing Store"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full py-3 pl-11 pr-4 border border-slate-200 rounded-xl outline-none focus:border-slate-500 focus:ring-4 focus:ring-slate-400/15 transition-all" 
                />
            </div>
            
            {/* Live Link Disclaimer */}
            <p className="text-[11px] text-slate-400 mt-1 ml-1">
                Your store will be live at: 
                <span className="text-blue-600 font-medium lowercase">
                {" "}{storeName ? storeName.replace(/\s+/g, '-').toLowerCase() : "your-store"}.layemart.shop
                </span>
            </p>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-slate-600 ml-0.5">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-500" size={18} />
                <input 
                    type="email" 
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-3 pl-11 pr-4 border border-slate-200 rounded-xl outline-none focus:border-slate-500 focus:ring-4 focus:ring-slate-400/15 transition-all" 
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-semibold text-slate-600 ml-0.5">Create Password</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-500" size={18} />
                <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  className="w-full py-3 pl-11 pr-11 border border-slate-200 rounded-xl outline-none focus:border-slate-500 focus:ring-4 focus:ring-slate-400/15 transition-all" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Free Trial CTA Button */}
            <button
            disabled={loading}
            className="w-full mt-4 bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 group disabled:opacity-60"
            >
            {loading ? "Creating Store..." : "Start My 14-Day Free Trial"}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>


            <p className="text-center text-xs text-slate-400 mt-4 px-6">
              By clicking the button above, you agree to our 
              <span className="text-slate-600 font-semibold cursor-pointer"> Terms of Service </span> 
              and <span className="text-slate-600 font-semibold cursor-pointer"> Privacy Policy</span>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}