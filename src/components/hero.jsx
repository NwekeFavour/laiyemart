import React from 'react';
import Header from './mainheader';
import { Button } from '@mui/joy';

export default function Hero({onCreateStore}) {
  return (
<section className="relative overflow-hidden bg-[#f3f4ff] min-h-screen">
      
      {/* Decorative Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200 blur-[100px] opacity-60"></div>
      <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[40%] rounded-full bg-indigo-200 blur-[120px] opacity-70"></div>
      <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] rounded-full bg-purple-100 blur-[80px] opacity-50"></div>

      {/* Content Layer (Ensure it stays on top with relative z-10) */}
      <div className="hero-content relative z-10">
        <Header />
        <div className='flex items-center justify-center md:pt-30 pt-28 lg:pt-40 md:mx-10'>
          <div className="max-w-7xl px-4">
            <h1 className="m-0 text-center font-bold lg:text-[36px] md:text-[24px] sm:text-[20px] text text-[17px] text-slate-900 leading-tight">
              Build ecommerce stores <br className="hidden md:block"/> 
              that <span className="text-slate-600 lg:text-[36px] text">sell</span>, without the hassle.
            </h1>
            
            <p className="lg:mt-6 mt-4 text-center text-slate-600 md:text-lg max-w-2xl mx-auto">
              Launch faster with pre-built layouts, optimized checkout flows, and tools designed for modern online brands.
            </p>
            
            <div className='flex justify-center items-center mt-8'>
              <Button
                onClick={onCreateStore}
                size="lg"
                className="bg-slate-900! sm:text-[16px]! text-[14px]! hover:bg-neutral-800! text-white px-4!  sm:px-8! py-3! rounded-xl transition-all"
              >
                Create Your Store
              </Button>
            </div>

            {/* Optional: Avatar/Rating section as seen in your screenshot */}
            <div className="mt-10 flex flex-col items-center gap-2">
               <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200" />
                  ))}
               </div>
               <p className="text-sm text-slate-500 font-medium">Trusted by thousands of enterprises</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
