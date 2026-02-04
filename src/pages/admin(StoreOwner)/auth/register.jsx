import React, { useState } from "react";
import {
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Typography } from "@mui/joy";
import { useCustomerAuthStore } from "../../../store/useCustomerAuthStore";
import { registerCustomer } from "../../../../services/customerService";
import { getSubdomain } from "../../../../storeResolver";
import { toast } from "react-toastify";

export default function CustomerSignUp({ isStarter, storeSlug, storeData }) {
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!storeSlug) {
      setError("We couldn't identify which store you are joining.");
      return;
    }
    setError(null);
    try {
      const data = await registerCustomer({
        name: formData.firstName + " " + formData.lastName,
        email: formData.email,
        password: formData.password,
        storeSlug, // 👈 important (subdomain)
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
      toast.success("User Registered Successfully", {
        containerId: "STOREFRONT",
      });
      setTimeout(() => {
        navigate(getStorePath(`/`));
      }, 3000);
    } catch (err) {
      toast.error(err.message, {
        containerId: "STOREFRONT",
      });
      setTimeout(() => {
        setError(err.message || "Registration failed. Please try again.");
      }, 2000);
      setTimeout(() => setError(null), 7000);
    } finally {
      setError(null);
      setLoading(false);
    }
  };

  const getStorePath = (path) => {
    return isStarter ? `/${storeSlug}${path}` : path;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-5 px-6 shadow-xl shadow-slate-200/50 rounded-[24px] border border-slate-100">
          <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Create your account
            </h2>

            {/* Store Branding */}
            <div onClick={() => navigate(getStorePath("/"))} className="flex items-center gap-3 justify-start w-full my-3 cursor-pointerodemon
            "> 
              {/* LOGO SECTION */}
              <div className="relative">
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
              <div className="flex flex-col justify-start">
                <Typography
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: "15px", lg: "18px" },
                    color: "neutral.900",
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                    textTransform: "uppercase",
                  }}
                >
                  {storeData?.name || "My Store"}
                </Typography>

                <Typography
                  className="text-start!"
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
          </div>
          <form className="space-y-5" onSubmit={handleRegister}>
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase ml-1">
                  First Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
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
                <label className="text-xs font-bold text-slate-600 uppercase ml-1">
                  Last Name
                </label>
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
              <label className="text-xs font-bold text-slate-600 uppercase ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  name="email"
                  value={formData.email}
                  type="email"
                  required
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-slate-500 focus:bg-white transition-all text-sm"
                  placeholder="jane@example.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase ml-1">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
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
              Already have an account?{" "}
              <Link
                to={getStorePath(`/login`)}
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
