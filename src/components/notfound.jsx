import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Home, Search } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Visual Element */}
          <div className="relative inline-block mb-8">
            <div className="w-24 h-24 bg-red-100 rounded-3xl flex items-center justify-center mx-auto rotate-12">
              <Search size={40} className="text-red-600 -rotate-12" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-xs border-4 border-slate-50">
              404
            </div>
          </div>

          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-3">
            LOST IN THE MART?
          </h1>
          <p className="text-slate-500 text-sm mb-10 leading-relaxed">
            We couldn't find the page you're looking for. It might have been moved, 
            deleted, or perhaps it never existed.
          </p>

          <div className="flex flex-col gap-3">
            
            <Link
              to="/"
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-all shadow-lg shadow-slate-200 active:scale-95"
            >
              <Home size={18} />
              Return Home
            </Link>
          </div>
        </motion.div>

        <p className="mt-12 text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
          LayeMart System Security Verified
        </p>
      </div>
    </div>
  );
}