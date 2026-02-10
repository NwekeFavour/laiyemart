import React from 'react';
import Header from './mainheader';
import { Button } from '@mui/joy';
import { ArrowRight, Play } from 'lucide-react';
export default function Hero({ onCreateStore }) {
  return (
    <section className="relative overflow-hidden bg-[#f3f4ff] lg:min-h-screen rounded-b-4xl">
      
      {/* Decorative Background Blobs - Matches Reference Style */}
      <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] rounded-full bg-blue-200 blur-[120px] opacity-60"></div>
      <div className="absolute bottom-[5%] right-[-5%] w-[35%] h-[45%] rounded-full bg-indigo-200 blur-[130px] opacity-70"></div>

      <div className="hero-content relative z-10">
        <Header />
        
        <div className='flex flex-col items-center justify-center md:pt-32 pt-32 lg:pt-44 px-4'>
          <div className="max-w-7xl w-full text-center">
            
            {/* Heading with styled accent word */}
            <h1 className="m-0 font-black  tracking-[-0.03em] lg:text-[60px] md:text-[26px] text-[18px] text-[#0F172A] leading-[1.05] font-['BBH_Bartle']">
              Build ecommerce stores 
              <br className="hidden md:block"/> 
              <span className="block md:inline mt-1">
                that <span className="relative inline-block">
                  <span className="relative  z-10 italic text-transparent bg-clip-text textt bg-gradient-to-r from-slate-600 to-slate-400">sell</span>
                  <span className="absolute bottom-1 left-0 w-full h-[6px] bg-slate-100 -z-0 rounded-full md:hidden"></span>
                </span>, without the hassle.
              </span>
            </h1>
            
            <p className="mt-6 text-slate-600 md:text-xl text-lg max-w-2xl mx-auto leading-relaxed">
              Launch faster with pre-built layouts, optimized checkout flows, and tools designed for modern online brands.
            </p>
            
            <div className='flex flex-col sm:flex-row justify-center items-center gap-4 my-5 sm:my-10 '>
              <div className='flex flex-col sm:flex-row justify-center items-center gap-4 mt-10 mb-6'>
                <Button
                className='hover:bg-[#4F46E5]!'
                onClick={onCreateStore}
                size="lg"
                endDecorator={<ArrowRight size={18} />}
                sx={{
                  backgroundColor: '#0f172a',
                  fontSize: '16px',
                  px: 4,
                  py: 1.5,
                  borderRadius: 'xl',
                  boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.3)',
                  '&:hover': { backgroundColor: '#1e293b' }
                }}
              >
                Try Demo
                </Button>                             
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}