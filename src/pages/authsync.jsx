import { CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
// This component bridges the gap between domains
export default function AuthSync() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // AuthSync.jsx
  useEffect(() => {
    const data = searchParams.get("data");
    const action = searchParams.get("action"); // Add an action param
    const redirect = searchParams.get("redirect") || "/";

    // If the action is logout, clear storage on this subdomain
    if (action === "logout") {
      localStorage.removeItem("layemart-auth");
      window.location.replace(redirect);
      return;
    }

    if (data) {
      try {
        localStorage.setItem("layemart-auth", decodeURIComponent(data));
        window.location.replace(redirect);
      } catch (err) {
        console.error("Sync Error:", err);
        window.location.replace("/auth/sign-in");
      }
    } else {
      // If someone visits /auth-sync with no data and no logout action,
      // they are likely trying to bypass login. Send them away.
      window.location.replace("/auth/sign-in");
    }
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white text-slate-900">
      {/* Top Loading Bar (Stripe-style) */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 2, ease: "easeInOut" }}
        className="fixed top-0 left-0 h-1 bg-red-500 z-50"
      />

      <div className="flex flex-col items-center gap-6">
        {/* Minimalist Logo Container */}
        <div className="relative flex items-center justify-center w-20 h-20">
          {/* Subtle Outer Glow */}
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 bg-red-500 rounded-2xl blur-xl"
          />

          {/* Main Logo Icon */}
          <div className="relative w-16 h-16 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center justify-center">
            <span className="text-3xl font-black text-red-500 tracking-tighter">
              L
            </span>

            {/* Spinning Ring - Thin and elegant */}
            <div className="absolute inset-[-4px] border-2 border-transparent border-t-red-500/30 rounded-2xl animate-spin" />
          </div>
        </div>

        {/* Text Section */}
        <div className="text-center space-y-1">
          <h2 className="text-sm font-bold tracking-[0.2em] text-slate-400 uppercase">
            Laye<span className="text-slate-900">mart</span>
          </h2>
        </div>
      </div>

      {/* Footer Branding (Optional) */}
      <div className="absolute bottom-10 text-[10px] text-slate-300 font-medium tracking-widest uppercase">
        Secure Gateway
      </div>
    </div>
  );
}
