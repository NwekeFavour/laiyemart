import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, AlertCircle, ArrowRight } from "lucide-react";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const ref = params.get("reference");

    if (!ref) {
      setStatus("error");
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/payments/verify?reference=${ref}`);
        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          // Hold the success screen for a moment for UX
          setTimeout(() => navigate("/dashboard/beta"), 3000);
        } else {
          setStatus("error");
        }
      } catch (err) {
        setStatus("error");
      }
    };

    verifyPayment();
  }, [params, navigate, BACKEND_URL]);

  return (
    <div className="min-h-screen bg-[#fcfcfc] flex items-center justify-center p-6 font-sans">
      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="max-w-md w-full bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-10 text-center"
        >
          {status === "verifying" && (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Verifying Payment</h2>
              <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                We're confirming your transaction with the processor. <br />
                Please don't refresh this page.
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", damping: 12, stiffness: 200 }}
                className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6"
              >
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </motion.div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase">Success!</h2>
              <p className="text-gray-500 mt-3 text-sm">
                Your payment has been processed. <br /> 
                Welcome to the next level of Layemart.
              </p>
              
              <div className="w-full mt-8 pt-6 border-t border-gray-50">
                <div className="relative w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.8, ease: "easeInOut" }}
                    className="absolute top-0 left-0 h-full bg-green-500"
                  />
                </div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 mt-4">
                  Redirecting to your store
                </p>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Something went wrong</h2>
              <p className="text-gray-500 mt-2 text-sm">
                We couldn't verify this transaction reference. <br />
                If you were charged, don't worry—contact our team.
              </p>
              <button
                onClick={() => navigate("/dashboard")}
                className="mt-8 flex items-center justify-center gap-2 w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-zinc-800 transition-all group"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}