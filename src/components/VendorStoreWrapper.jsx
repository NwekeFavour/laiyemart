import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Turnstile from 'react-turnstile';

const VendorStoreWrapper =({ children }) =>{
  const [hasPassedGate, setHasPassedGate] = useState(false);

  // Optional: Remember the user for 30 minutes so they don't get annoyed
  useEffect(() => {
    const isVerified = sessionStorage.getItem('store_verified');
    if (isVerified) setHasPassedGate(true);
  }, []);

  // Inside your StoreGatekeeper.jsx
const handleVerify = async (token) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/stores/verify-gatekeeper`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });

    const data = await response.json();

    if (data.success) {
      sessionStorage.setItem('store_verified', 'true');
        setHasPassedGate(true);
    } else {
      toast.error("Verification failed. Please refresh.", {containerId: "STOREFRONT"});
    }
  } catch (error) {
      console.error("Auth error:", error);
      toast.error("Network error. Please try again.", {containerId: "STOREFRONT"});
    }
};

// Update your Turnstile component:
<Turnstile
  sitekey={import.meta.env.VITE_CLOUDFLARE_KEY}
  onVerify={handleVerify} // Calls our new function
/>

  if (!hasPassedGate) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 max-w-md w-full text-center animate-in fade-in zoom-in duration-300">
          
          <div className="mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl rotate-12 flex items-center justify-center mx-auto shadow-lg shadow-blue-200">
               <span className="text-white font-black text-xl -rotate-12">L</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-800 mb-2">Security Check</h2>
          <p className="text-slate-500 mb-8 text-sm">
            To protect our vendors, please complete the quick verification below to enter the store.
          </p>

          <div className="flex justify-center mb-6">
            <Turnstile
              sitekey={`${import.meta.env.VITE_CLOUDFLARE_SITE_KEY}`}
              onVerify={handleVerify}
            />
          </div>

          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
            Layemart Secure Access
          </p>
        </div>
      </div>
    );
  }

  return children;
};

export default VendorStoreWrapper