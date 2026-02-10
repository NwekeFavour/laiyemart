import React, { useEffect, useState } from "react";
import {
  Mail,
  Lock,
  User,
  Store,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  registerStoreOwner,
  updateStorePlan,
  verifyOTP,
} from "../../../services/authService"; // Ensure verifyOTP is exported from your service
import { toast } from "react-toastify";
import { useAuthStore } from "../../store/useAuthStore";

export default function SignUpPage() {
  // 1. New State Management
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("starter");
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [storeName, setStoreName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [latestDiscount, setLatestDiscount] = useState(null);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [billingCycle, setBillingCycle] = useState("monthly");
  const navigate = useNavigate();
  const [resendTimer, setResendTimer] = useState(0);

  const startResendTimer = () => {
    setResendTimer(30); // 30 seconds cooldown
  };

  React.useEffect(() => {
    if (resendTimer === 0) return; // nothing to do if timer is 0

    const interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval); // cleanup
  }, [resendTimer]);

  const plans = [
    {
      id: "starter",
      name: "Starter Plan",
      price: { monthly: "Free", yearly: "Free" },
      features: ["100 Products", "Basic Analytics", "Custom Domain"],
    },
    {
      id: "professional",
      name: "Professional Plan",
      price: { monthly: "₦15,000", yearly: "₦153,000" },
      features: ["200 Products", "Advanced SEO", "Priority Support"],
    },
  ];
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/resend-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );
      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      toast.success(data.message);
      startResendTimer(); // start 30s countdown
    } catch (err) {
      toast.error(err.message);
    } finally {
    }
  };

  const handlePay = async (planType, storeId, cycle) => {
    try {
      const { user, token } = useAuthStore.getState();
      
      // 🔐 Auth check
      if (!token || !user) {
        window.location.href = "/auth/sign-in";
        return;
      }

      // 🏪 Store check
      if (!storeId) {
        toast.error("No active store selected");
        return;
      }

      // Use a toast or loading state here if you have one
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/paystack/init`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: user.email,
          plan: planType, // Now dynamic: "PROFESSIONAL" or "ENTERPRISE"
          storeId: storeId,
          billingCycle: cycle,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Payment failed");

      // 🚀 Redirect to Paystack Checkout
      window.location.href = data.url;
    } catch (err) {
      console.error("Payment Error:", err.message);
      toast.error(err.message);
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
      setStep(3);

      // On success, go to sign-in or dashboard
      //   navigate("/auth/sign-in");
    } catch (err) {
      setError(err?.message || "Invalid OTP code.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchLatestCoupon = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/coupon`,
        );
        const data = await res.json();
        if (data.success && data.coupons.length > 0) {
          // Assuming the first one is the most recent due to your .sort({createdAt: -1})
          setLatestDiscount(data.coupons[0].discountPercent);
        }
      } catch (err) {
        console.error("Failed to fetch latest coupon offer", err);
      }
    };
    fetchLatestCoupon();
  }, []);

  const handleValidateCoupon = async () => {
    if (!couponCode) return;
    setIsValidatingCoupon(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/coupon/validate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: couponCode }),
        },
      );
      const data = await res.json();

      if (data.success) {
        setAppliedDiscount(data.discountPercent);
        toast.success(`Coupon applied! ${data.discountPercent}% off.`);
      } else {
        setAppliedDiscount(0);
        toast.error(data.message || "Invalid coupon");
      }
    } catch (err) {
      toast.error("Error validating coupon");
    } finally {
      setIsValidatingCoupon(false);
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

      <div className="max-w-5xl w-full grid md:grid-cols-2 bg-white rounded-[32px] shadow-2xl overflow-hidden z-10">
        {/* Left Side: Marketing/Value Prop - Logic added to headline */}
        <div className="hidden md:flex flex-col justify-center p-12 bg-slate-900 text-white relative">
          <div
            onClick={() => navigate("/")}
            className="absolute cursor-pointer top-8 left-8 flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-md bg-red-500" />
            <span className="font-bold tracking-tight text-lg text">
              LAYEMART
            </span>
          </div>

          <h2 className="lg:text-4xl md:tetx-[26px] text-[24px] font-bold leading-tight mb-6">
            {step === 1
              ? "Start your journey to "
              : "Almost there! Verify your "}
            <span className="text-blue-400">
              {step === 1 ? "financial freedom" : "account"}
            </span>{" "}
            today.
          </h2>

          <div className="space-y-6">
            {[
              "Set up your store in less than 5 minutes",
              "Integrated local payment gateways",
            ].map((text, i) => (
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
              <div className="md:mb-3 mb-1">
                <h1 className="text-2xl font-extrabold text-slate-900">
                  Create your store account
                </h1>
                <div className="flex flex-wrap md:mt-0 mt-2 items-center gap-2 mt-1">
                  <span className="bg-blue-50 text-blue-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-blue-100">
                    Early Access
                  </span>
                  <p className="text-slate-500 text-sm">
                    Be among the first to build with Layemart.
                  </p>
                </div>
              </div>

              <form
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  setLoading(true);
                  try {
                    const registrationData = {
                      email,
                      password,
                      fullName: fullName || "", // Fallback to empty string
                      storeName: storeName || "My Store", // Fallback to a default name
                      // Only generate subdomain if storeName exists, otherwise empty string
                      subdomain: storeName
                        ? storeName.toLowerCase().trim().replace(/\s+/g, "-")
                        : "",
                      plan: selectedPlan,
                      couponCode:
                        appliedDiscount > 0
                          ? couponCode.trim().toUpperCase()
                          : null,
                      billingCycle,
                    };

                    // 2. Call the service
                    await registerStoreOwner(registrationData);
                    setStep(2); // Move to OTP step
                  } catch (err) {
                    setError(
                      err?.message === "Failed to fetch"
                        ? "Network error: Unable to reach the server."
                        : err.message,
                    );
                    if (password.length < 8) {
                      toast.error(
                        "password is shorter than the minimum allowed length",
                      );
                    }
                    setTimeout(() => setError(null), 4000);
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

                <div className="grid lg:grid-cols-2 md:space-y-0 space-y-3 space-x-4">
                  {/* <div className="flex flex-col gap-1.5 lg:me-4 me-0">
                    <label className="text-[13px] font-semibold text-slate-600 ml-0.5">
                      Full Name
                    </label>
                    <div className="relative group">
                      <User
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-500"
                        size={18}
                      />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full py-3 pl-11 pr-4 border border-slate-200 rounded-xl outline-none focus:border-slate-500 focus:ring-4 focus:ring-slate-400/15 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[13px] font-semibold text-slate-600 ml-0.5">
                      Store Name
                    </label>
                    <div className="relative group">
                      <Store
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-500"
                        size={18}
                      />
                      <input
                        type="text"
                        placeholder="My Amazing Store"
                        value={storeName}
                        onChange={(e) => setStoreName(e.target.value)}
                        className="w-full py-3 pl-11 pr-4 border border-slate-200 rounded-xl outline-none focus:border-slate-500 focus:ring-4 focus:ring-slate-400/15 transition-all"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 ml-1">
                      Your store will be live at:
                      <span className="text-blue-600 font-medium lowercase">
                        {" "}
                        {storeName
                          ? storeName.replace(/\s+/g, "-").toLowerCase()
                          : "your-store"}
                        .layemart.shop
                      </span>
                    </p>
                  </div> */}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-slate-600 ml-0.5">
                    Email Address
                  </label>
                  <div className="relative group">
                    <Mail
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="email"
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full py-3 pl-11 pr-4 border border-slate-200 rounded-xl outline-none focus:border-slate-500 transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-slate-600 ml-0.5">
                    Password
                  </label>
                  <div className="relative group">
                    <Lock
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      required
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full py-3 pl-11 pr-11 border rounded-xl outline-none transition-all ${
                        password
                          ? getStrength(password) < 3
                            ? "border-orange-300 focus:border-orange-500"
                            : "border-green-300 focus:border-green-500"
                          : "border-slate-200 focus:border-slate-500"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {/* --- PASSWORD STRENGTH DISCLAIMER BANNER --- */}
                  {password.length > 0 && (
                    <div
                      className={`mt-2 p-3 rounded-xl border transition-all ${getStrength(password) < 3 ? "bg-orange-50 border-orange-100" : "bg-green-50 border-green-100"}`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((s) => (
                            <div
                              key={s}
                              className={`h-1.5 w-6 rounded-full ${s <= getStrength(password) ? (getStrength(password) < 3 ? "bg-orange-400" : "bg-green-500") : "bg-slate-200"}`}
                            />
                          ))}
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider ${getStrength(password) < 3 ? "text-orange-700" : "text-green-700"}`}
                        >
                          {getStrength(password) < 3 ? "Weak" : "Secure"}
                        </span>
                      </div>
                      <ul className="text-[11px] space-y-1 text-slate-500 font-medium">
                        <li className="flex items-center gap-1.5">
                          <div
                            className={`w-1 h-1 rounded-full ${password.length >= 8 ? "bg-green-500" : "bg-slate-300"}`}
                          />
                          At least 8 characters
                        </li>
                        <li className="flex items-center gap-1.5">
                          <div
                            className={`w-1 h-1 rounded-full ${/[0-9!@#$%^&*]/.test(password) ? "bg-green-500" : "bg-slate-300"}`}
                          />
                          Include a number or special character
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
                {/* --- COUPON SECTION --- */}
                <div className="mt-4">
                  {!showCouponInput ? (
                    <button
                      type="button"
                      onClick={() => setShowCouponInput(true)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Have a coupon code?
                    </button>
                  ) : (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                      <label className="text-[13px] font-semibold text-slate-600 ml-0.5">
                        Promo Code
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <ShieldCheck
                            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                            size={18}
                          />
                          <input
                            type="text"
                            placeholder="ENTER CODE"
                            value={couponCode}
                            onChange={(e) =>
                              setCouponCode(e.target.value.toUpperCase())
                            }
                            className="w-full py-2.5 pl-11 pr-4 border border-slate-200 rounded-xl outline-none focus:border-blue-500 uppercase font-bold tracking-wider text-sm"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleValidateCoupon}
                          disabled={isValidatingCoupon || !couponCode}
                          className="px-4 bg-blue-50 text-blue-600 font-bold rounded-xl border border-blue-100 hover:bg-blue-100 disabled:opacity-50 text-sm"
                        >
                          {isValidatingCoupon ? "..." : "Apply"}
                        </button>
                      </div>
                      {appliedDiscount > 0 && (
                        <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                          <CheckCircle2 size={12} /> {appliedDiscount}% discount
                          will be applied to your plan!
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <button
                  disabled={loading}
                  className="w-full mt-4 bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 group disabled:opacity-60"
                >
                  {loading ? "Processing..." : "Create Your Account"}
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </form>
              <p className="text-sm text-slate-500 mt-4">
                Already have an account?{" "}
                <span
                  onClick={() => navigate("/auth/sign-in")}
                  className="text-slate-600 font-semibold cursor-pointer hover:underline"
                >
                  Sign In
                </span>
              </p>
            </>
          ) : step === 2 ? (
            /* --- STEP 2: OTP VERIFICATION FORM --- */
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <button
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-slate-400 hover:text-slate-600 mb-6 text-sm font-medium"
              >
                <ArrowLeft size={16} /> Back to details
              </button>

              <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-slate-900">
                  Check your email
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  We've sent a 6-digit verification code to{" "}
                  <span className="font-semibold text-slate-900">{email}</span>
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleVerifyOtp}>
                {error && (
                  <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-[13px] font-semibold text-slate-600 ml-0.5">
                    Verification Code
                  </label>
                  <div className="relative group">
                    <ShieldCheck
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) =>
                        setOtp(e.target.value.replace(/\D/g, ""))
                      }
                      placeholder="000000"
                      className="w-full py-4 pl-11 pr-4 border border-slate-200 rounded-xl outline-none focus:border-slate-500 focus:ring-4 focus:ring-slate-400/15 transition-all text-2xl tracking-[0.5em] font-bold"
                    />
                  </div>
                </div>

                <button
                  disabled={loading || otp.length < 6}
                  className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 disabled:opacity-60"
                >
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
          ) : (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="mb-6">
                <h1 className="text-2xl font-extrabold text-slate-900">
                  Choose your plan
                </h1>
                <p className="text-slate-500 text-sm mt-1">
                  Select the best way to power your store.
                </p>
              </div>

              {latestDiscount && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-3 animate-pulse">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-blue-900">
                      Limited Time Offer!
                    </p>
                    <p className="text-[11px] text-blue-700 font-medium">
                      Use a coupon code to get{" "}
                      <span className="font-bold text-blue-900">
                        {latestDiscount}% OFF
                      </span>{" "}
                      your first subscription.
                    </p>
                  </div>
                </div>
              )}

              {/* Toggle Switch */}
              <div className="flex items-center justify-center mb-5">
                <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                  <button
                    onClick={() => setBillingCycle("monthly")}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition ${
                      billingCycle === "monthly"
                        ? "bg-white shadow text-slate-900"
                        : "text-slate-500"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingCycle("yearly")}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition ${
                      billingCycle === "yearly"
                        ? "bg-white shadow text-slate-900"
                        : "text-slate-500"
                    }`}
                  >
                    Yearly{" "}
                    <span className="ml-1 text-[10px] text-emerald-600">
                      (Save 15%)
                    </span>
                  </button>
                </div>
              </div>

              {/* Plans List */}
              <div className="space-y-3">
                {plans.map((plan) => {
                  const isSelected = selectedPlan === plan.id;
                  return (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        isSelected
                          ? "border-blue-600 ring-2 ring-blue-600/10 bg-blue-50/30"
                          : "border-slate-100 bg-white hover:border-slate-200"
                      }`}
                    >
                      {plan.id === "professional" && (
                        <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] px-3 py-1 rounded-bl-lg font-bold uppercase">
                          Popular
                        </div>
                      )}
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          {/* 1. Plan Name */}
                          <h3 className="font-bold text-slate-900 flex items-center gap-2">
                            {plan.name}
                            {appliedDiscount > 0 && plan.id !== "starter" && (
                              <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                                {appliedDiscount}% Off
                              </span>
                            )}
                          </h3>

                          {/* 2. Price Logic */}
                          <div className="text-lg font-extrabold text-slate-900 mt-0.5">
                            {appliedDiscount > 0 && plan.id !== "starter" ? (
                              <div className="flex flex-col leading-tight">
                                {/* Original Price (Strikethrough) */}
                                <span className="text-[11px] text-red-500 line-through opacity-70 font-medium">
                                  {plan.price[billingCycle]}
                                </span>
                                {/* New Calculated Price */}
                                <span className="flex items-baseline">
                                  ₦
                                  {Math.round(
                                    Number(
                                      plan.price[billingCycle].replace(
                                        /[^0-9.-]+/g,
                                        "",
                                      ),
                                    ) *
                                      (1 - appliedDiscount / 100),
                                  ).toLocaleString()}
                                  <span className="text-xs text-slate-400 font-normal ml-1">
                                    /{billingCycle === "monthly" ? "mo" : "yr"}
                                  </span>
                                </span>
                              </div>
                            ) : (
                              /* Default Price (No Discount) */
                              <span className="flex items-baseline">
                                {plan.price[billingCycle]}
                                <span className="text-xs text-slate-400 font-normal ml-1">
                                  /{billingCycle === "monthly" ? "mo" : "yr"}
                                </span>
                              </span>
                            )}
                          </div>
                        </div>

                        {/* 3. Selection Radio Indicator */}
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                            isSelected
                              ? "border-blue-600 bg-blue-600"
                              : "border-slate-300"
                          }`}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                      </div>
                      <ul className="grid grid-cols-2 gap-x-2 gap-y-1">
                        {plan.features.map((feat, i) => (
                          <li
                            key={i}
                            className="flex items-center gap-1.5 text-[11px] text-slate-600"
                          >
                            <CheckCircle2
                              size={12}
                              className="text-emerald-500"
                            />{" "}
                            {feat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>

              {/* Updated Complete Setup Button */}
              <button
                onClick={async () => {
                  setLoading(true);
                  try {
                    const payload = {
                      email,
                      plan: selectedPlan, // This is the value from your state
                      billingCycle,
                    };

                    // 1. Update the backend
                    const response = await updateStorePlan(payload);
                    const storeId = response.store._id;
                    // 2. Logic Check: Use 'selectedPlan' directly!
                    // We use .toLowerCase() to be safe against "Professional" vs "professional"
                    if (response.store.plan === "professional") {
                      // Since this is a subaccount transaction, we MUST ensure handlePay
                      // is called with the most recent billing cycle.
                      await handlePay(response.store.plan, storeId, billingCycle);
                    } else if(response.store.plan === "starter") {
                      // Logic for Free/Starter plans
                      const authString = localStorage.getItem("layemart-auth");
                      const encodedAuth = encodeURIComponent(authString);
                      const { protocol } = window.location;
                      const base = window.location.hostname.includes(
                        "localhost",
                      )
                        ? "dashboard.localhost:5173"
                        : "dashboard.layemart.com";

                      window.location.href = `${protocol}//${base}/auth-sync?data=${encodedAuth}`;
                    }
                  } catch (err) {
                    setError("Could not save plan. Please try again.");
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                className="w-full mt-6 bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all shadow-xl flex items-center justify-center gap-2 group"
              >
                {loading ? "Finalizing..." : "Complete Setup"}
                {!loading && (
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                )}
              </button>
            </div>
          )}

          {/* Footer disclaimer stays at the bottom */}
          <p className=" text-xs text-slate-400 md:mt-3 mt-2 ">
            By clicking the button above, you agree to our
            <span className="text-slate-600 font-semibold cursor-pointer">
              {" "}
              Terms of Service{" "}
            </span>
            and{" "}
            <span className="text-slate-600 font-semibold cursor-pointer">
              {" "}
              Privacy Policy
            </span>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
