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
    <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
      <div className="relative flex items-center justify-center">
        {/* Outer Pulsing Ring */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute w-24 h-24 rounded-full bg-red-500"
        />
        
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-slate-200 border-t-red-500 rounded-full animate-spin" />

        {/* Layemart "L" Logo in center */}
        <div className="absolute font-black text-red-500 text-xl">L</div>
      </div>

      <div className="mt-8 text-center">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          LAYE<span className="text-red-500">MART</span>
        </h2>
        {/* <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-slate-500 text-sm mt-2 font-medium"
        >
          Securing your session...
        </motion.p> */}
      </div>
    </div>
  );
}
