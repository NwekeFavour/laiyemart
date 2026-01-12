import React from 'react';
import { Store, ArrowLeft } from 'lucide-react';

export default function StoreNotFound() {
  // Dynamically determine the base domain (e.g., localhost:5173 or Layemart.com)
  const getBaseUrl = () => {
    const { hostname, port } = window.location;
    // Remove the subdomain to get the root domain
    const parts = hostname.split('.');
    let base = parts.length > 2 ? parts.slice(-2).join('.') : hostname;
    
    // For localhost, we need to handle the specific "localhost" string
    if (hostname.includes('localhost')) base = 'localhost';
    
    return `${window.location.protocol}//${base}${port ? ':' + port : ''}`;
  };

  const baseUrl = getBaseUrl();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 text-center overflow-hidden w-full bg-white">
      {/* Background Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100 blur-[100px] opacity-60 pointer-events-none"></div>
      <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[40%] rounded-full bg-indigo-100 blur-[120px] opacity-70 pointer-events-none"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-red-100">
          <Store className="text-red-500" size={40} />
        </div>
        
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
          Store Not Found
        </h1>
        
        <p className="text-slate-500 max-w-md mb-10 leading-relaxed">
          The store at this address doesn't exist or may have been moved. 
          Please double-check the subdomain and try again.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <a 
            href={baseUrl} 
            className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95"
          >
            <ArrowLeft size={18} />
            Back to Home
          </a>
          
          <a 
            href={`${baseUrl}/auth/sign-up`} 
            className="px-8 py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
          >
            Create Your Own Store
          </a>
        </div>

        <div className="mt-16 flex flex-col items-center gap-2">
          <div className="h-px w-12 bg-slate-200"></div>
          <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-black">
            Powered by Layemart
          </p>
        </div>
      </div>
    </div>
  );
}