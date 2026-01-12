import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Typography } from '@mui/joy';
import { useCustomerAuthStore } from '../../../store/useCustomerAuthStore';
import { registerCustomer } from '../../../../services/customerService';
import { getSubdomain } from '../../../../storeResolver';
import { toast } from 'react-toastify';

export default function CustomerSignUp() {
    const { storeSlug: paramSlug } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const login = useCustomerAuthStore((s) => s.login);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const activeSlug = paramSlug || getSubdomain();
    const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!activeSlug) {
      setError("We couldn't identify which store you are joining.");
      return;
    }
    setError(null);
    try {
        const data = await registerCustomer({
            name : formData.firstName + " " + formData.lastName,
            email: formData.email,
            password: formData.password,
            storeSlug: activeSlug, // 👈 important (subdomain)
        });

        /**
         * Expected backend response:
         * {
         *   token,
         *   customer,
         *   store
         * }
         */

        // ✅ Store auth in Zustand
        login({
        token: data.token,
        customer: data.customer,
        store: data.store,
        });

        // ✅ Redirect to store home or account
        toast.success("User Registered Successfully")
        setTimeout(() => {
            navigate(`/`);
        }, 3000)
    } catch (err) {
        toast.error(err.message)
        setTimeout(() =>{
            setError(err.message || "Registration failed. Please try again.");
        }, 2000)
        setTimeout(() => setError(null), 7000)
    } finally {
        setError(null)
        setLoading(false);
    }
    };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Store Branding */}
        <div className='flex items-center justify-center  gap-2'>
            <div className="w-8 h-8 rounded-md bg-red-500" />
            <Typography className="text lg:text-[16px]! text-[13px]! text-black!" sx={{ fontWeight: 800, fontSize: '22px', color: "#f8fafc", letterSpacing: '-0.02em' }}>
               LAYE<span className='text' style={{ color: '#ef4444' }}>MART</span>
            </Typography>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Join <span className="font-semibold text-indigo-600 capitalize">{activeSlug || "our store"}</span> to track orders and checkout faster.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-[24px] border border-slate-100">
          <form className="space-y-5" onSubmit={handleRegister}>
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase ml-1">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    required
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-500 focus:bg-white transition-all text-sm"
                    placeholder="Jane"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase ml-1">Last Name</label>
                <input
                  name="lastName"
                value={formData.lastName}
                  type="text"
                  required
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-500 focus:bg-white transition-all text-sm"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  name="email"
                    value={formData.email

                    }
                  type="email"
                  required
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-500 focus:bg-white transition-all text-sm"
                  placeholder="jane@example.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                    value={formData.password}
                  onChange={handleChange}
                  className="w-full block bg-white text-slate-900 text-sm py-2.5 pl-11 pr-5
                                border border-slate-200 rounded-xl
                                placeholder:text-slate-400
                                transition-all duration-200
                                outline-none
                                focus:border-slate-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 px-1">
              <ShieldCheck className="text-emerald-500" size={16} />
              <p className="text-[11px] text-slate-500">
                Your data is encrypted and secure.
              </p>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3.5 rounded-xl font-bold hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-70 shadow-lg shadow-slate-200"
            >
              {loading ? "Creating account..." : "Create Account"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{' '}
              <Link                 
                to={`/login`}
                className="font-bold text-[#64748b] hover:text-[#0f172a] underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}