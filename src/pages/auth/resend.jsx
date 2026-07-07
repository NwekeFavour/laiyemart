import { useState } from "react";
import { Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Layemart from "/img/layemart-icon.jpg";

export default function ResendOTPPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Pre-fill email if passed via navigation state
  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(location.state?.email ? "otp" : "email");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const startTimer = () => {
    setResendTimer(30);
    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) { clearInterval(interval); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResend = async () => {
    if (!email) return toast.error("Please enter your email");
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("OTP sent! Check your email.");
      setStep("otp");
      startTimer();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length < 6) return toast.error("Enter the 6-digit code");
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Email verified! You can now sign in.");
      navigate("/auth/sign-in");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f4ff] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200 blur-[100px] opacity-60" />
      <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[40%] rounded-full bg-indigo-200 blur-[120px] opacity-70" />

      <div className="w-full max-w-md bg-white rounded-[28px] shadow-2xl p-8 z-10">
        {/* Logo */}
        <div className="flex justify-center mb-6 cursor-pointer" onClick={() => navigate("/")}>
          <img src={Layemart} alt="Layemart" className="h-16 w-auto object-contain" />
        </div>

        {step === "email" ? (
          <>
            <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Verify your email</h1>
            <p className="text-slate-500 text-sm mb-6">
              Enter your email address and we'll send you a new verification code.
            </p>

            <div className="flex flex-col gap-1.5 mb-4">
              <label className="text-[13px] font-semibold text-slate-600">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full py-3 pl-11 pr-4 border border-slate-200 rounded-xl outline-none focus:border-slate-500 focus:ring-4 focus:ring-slate-400/15 transition-all"
                />
              </div>
            </div>

            <button
              onClick={handleResend}
              disabled={loading || !email}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send Verification Code"}
              <ArrowRight size={18} />
            </button>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Check your email</h1>
            <p className="text-slate-500 text-sm mb-6">
              We sent a 6-digit code to <span className="font-semibold text-slate-900">{email}</span>
            </p>

            <form onSubmit={handleVerify} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-semibold text-slate-600">Verification Code</label>
                <div className="relative">
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

              <button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? "Verifying..." : "Verify & Sign In"}
                <ArrowRight size={18} />
              </button>
            </form>

            <p className="text-end text-sm text-slate-500 mt-3">
              Didn't receive it?{" "}
              <button
                onClick={handleResend}
                disabled={resendTimer > 0 || loading}
                className={`text-slate-900 font-bold hover:underline underline-offset-4 ${resendTimer > 0 ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend Code"}
              </button>
            </p>

            <button
              onClick={() => setStep("email")}
              className="w-full mt-2 text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              ← Use a different email
            </button>
          </>
        )}

        <p className="text-center text-sm text-slate-500 mt-6">
          Already verified?{" "}
          <span onClick={() => navigate("/auth/sign-in")} className="text-slate-700 font-semibold cursor-pointer hover:underline">
            Sign In
          </span>
        </p>
      </div>
    </div>
  );
}