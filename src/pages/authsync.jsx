import { CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Layemart from '../assets/img/layemart-icon.jpg'

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
  <div className="flex flex-col items-center justify-center h-screen bg-[#fafafa] text-slate-900 overflow-hidden">
    {/* Top Progress Bar - Royal Indigo */}
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      transition={{ duration: 2.5, ease: "easeInOut" }}
      className="fixed top-0 left-0 h-1 bg-[#2D2A70] z-50 shadow-[0_0_10px_rgba(45,42,112,0.3)]"
    />

    <div className="flex flex-col items-center gap-8">
      {/* Logo Container */}
      <div className="relative flex items-center justify-center">
        
        {/* Soft Branding Glow */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1], 
            opacity: [0.05, 0.15, 0.05] 
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute h-32 w-32 bg-[#2D2A70] rounded-full blur-3xl"
        />

        {/* Logo Reveal Animation */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative bg-white p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-50 flex items-center justify-center"
        >
          <img 
            src="https://res.cloudinary.com/dzrfqk1zk/image/upload/v1771239090/layemart-icon-removebg-preview_lh5vom.png" 
            alt="Layemart Logo" 
            className="h-16 w-auto object-contain"
          />
          
          {/* Animated Orbit Ring */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 border-[1.5px] border-transparent border-t-[#2D2A70] rounded-[2rem] opacity-40"
          />
        </motion.div>
      </div>

      {/* Modern Text Branding */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-center"
      >
        <h2 className="text-lg font-black tracking-[0.3em] text-[#2D2A70] uppercase">
          LAYE<span className="text-slate-400 font-light">MART</span>
        </h2>
        <div className="flex justify-center gap-1 mt-3">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              className="h-1 w-1 rounded-full bg-[#2D2A70]"
            />
          ))}
        </div>
      </motion.div>
    </div>

    {/* Footer Detail */}
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
      className="absolute bottom-12 flex flex-col items-center gap-2"
    >
      <span className="text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase">
        Layemart Engine
      </span>
      <div className="h-[1px] w-8 bg-slate-200" />
    </motion.div>
  </div>
  );
}
