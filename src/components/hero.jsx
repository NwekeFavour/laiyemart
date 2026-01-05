import React from 'react';
import Header from './mainheader';
import { Button } from '@mui/joy';

const AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&h=100&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80",
];

export default function Hero({ onCreateStore }) {
  return (
    <section className="relative overflow-hidden bg-[#f3f4ff] min-h-screen">
      
      {/* Decorative Background Blobs - Matches Reference Style */}
      <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] rounded-full bg-blue-200 blur-[120px] opacity-60"></div>
      <div className="absolute bottom-[5%] right-[-5%] w-[35%] h-[45%] rounded-full bg-indigo-200 blur-[130px] opacity-70"></div>

      <div className="hero-content relative z-10">
        <Header />
        
        <div className='flex flex-col items-center justify-center md:pt-32 pt-24 lg:pt-44 px-4'>
          <div className="max-w-7xl w-full text-center">
            
            {/* Heading with styled accent word */}
            <h1 className="m-0 text font-extrabold tracking-tight lg:text-[30px] md:text-[26px] text-[17px] text-slate-900 leading-[1.1]">
              Build ecommerce stores <br className="hidden md:block"/> 
              that <span className="text-slate-600 text">sell</span>, without the hassle.
            </h1>
            
            <p className="mt-6 text-slate-600 md:text-xl text-lg max-w-2xl mx-auto leading-relaxed">
              Launch faster with pre-built layouts, optimized checkout flows, and tools designed for modern online brands.
            </p>
            
            <div className='flex flex-col sm:flex-row justify-center items-center gap-4 mt-10'>
              <Button
                onClick={onCreateStore}
                size="lg"
                className="bg-slate-900! text-[16px]! hover:bg-slate-800! text-white lg:px-10! px-5 py-3 lg:py-4! rounded-xl transition-all shadow-xl shadow-slate-200"
              >
                Create Your Store
              </Button>
            </div>

            {/* Avatar & Rating Section */}
            <div className="mt-12 flex flex-col items-center gap-3">
              <div className="flex items-center">
                <div className="flex -space-x-3 mr-4">
                  {AVATARS.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`User ${i + 1}`}
                      className="w-12 h-12 rounded-full border-[3px] border-white object-cover shadow-sm"
                    />
                  ))}
                </div>
                {/* Star Rating as seen in screenshot */}
                <div className="flex gap-0.5 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-sm text-slate-500 font-semibold tracking-wide uppercase">
                Trusted by 10,000+ modern brands
              </p>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
}