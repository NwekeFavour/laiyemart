import React from 'react';
import Header from './mainheader';
import { Button } from '@mui/joy';
export default function Hero({ onCreateStore }) {
  return (
    <section className="relative overflow-hidden bg-[#f3f4ff] lg:min-h-screen rounded-b-4xl">
      
      {/* Decorative Background Blobs - Matches Reference Style */}
      <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] rounded-full bg-blue-200 blur-[120px] opacity-60"></div>
      <div className="absolute bottom-[5%] right-[-5%] w-[35%] h-[45%] rounded-full bg-indigo-200 blur-[130px] opacity-70"></div>

      <div className="hero-content relative z-10">
        <Header />
        
        <div className='flex flex-col items-center justify-center md:pt-32 pt-24 lg:pt-44 px-4'>
          <div className="max-w-7xl w-full text-center">
            
            {/* Heading with styled accent word */}
            <h1 className="m-0 font-extrabold text textt tracking-[-0.03em] lg:text-[42px] md:text-[26px] text-[18px] text-slate-900 leading-[1.05] font-['BBH_Bartle']">
              Build ecommerce stores 
              <br className="hidden md:block"/> 
              <span className="block md:inline mt-1 textt text">
                that <span className="relative inline-block">
                  <span className="relative text z-10 italic text-transparent bg-clip-text textt bg-gradient-to-r from-slate-600 to-slate-400">sell</span>
                  <span className="absolute bottom-1 left-0 w-full h-[6px] bg-slate-100 -z-0 rounded-full md:hidden"></span>
                </span>, without the hassle.
              </span>
            </h1>
            
            <p className="mt-6 text-slate-600 md:text-xl text-lg max-w-2xl mx-auto leading-relaxed">
              Launch faster with pre-built layouts, optimized checkout flows, and tools designed for modern online brands.
            </p>
            
            <div className='flex flex-col sm:flex-row justify-center items-center gap-4 my-10 '>
              <Button
                onClick={onCreateStore}
                size="lg"
                className="bg-slate-900/90! text-[16px]! hover:bg-slate-800! text-white lg:px-8! px-5 py-3 lg:py-3! rounded-xl transition-all shadow-xl shadow-slate-200"
              >
                Quick Preview
              </Button>
            </div>

            <div className='lg:block hidden'>
              <div className="mt-12 my-5 flex items-center justify-center rounded-4xl imgsec relative">
                <button
                  className="
                    group
                    relative
                    flex items-center justify-center
                    h-16 w-16
                    rounded-full
                    bg-white
                    shadow-[0_12px_40px_rgba(0,0,0,0.35)]
                    transition
                    hover:scale-105
                    hover:shadow-[0_18px_60px_rgba(0,0,0,0.45)]
                    focus:outline-none
                  "
                  aria-label="Play video"
                >
                  {/* Glow ring */}
                  <span
                    className="
                      absolute inset-[-10px]
                      rounded-full
                      bg-white/20
                      blur-xl
                      opacity-0
                      transition
                      group-hover:opacity-100
                    "
                  />

                  {/* Play icon */}
                  <svg
                    viewBox="0 0 24 24"
                    className="relative ml-0.5 h-6 w-6 fill-black"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}