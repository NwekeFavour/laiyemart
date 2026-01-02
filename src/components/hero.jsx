import React from 'react';
import Header from './header';
import { Button } from '@mui/joy';

export default function Hero({onCreateStore}) {
  return (
    <section className="hero">
      <div className="hero-content">
        <Header/>

        <div className='flex items-center justify-center md:mt-16 mt-14 lg:mt-30 md:mx-10'>
            <div>
                <p className="m-0 text text-center lg:text-[30px] md:text-[24px] sm:text-[17px] text-[14px] text-neutral-900">Build ecommerce stores that sell, without the hassle.</p>
                <p className="lg:mt-4 mt-2 text-center text-neutral-800 md:mx-0 mx-3">Launch faster with pre-built layouts, optimized checkout flows, and tools designed for modern online brands.</p>
                <div className='flex justify-center items-center mt-3'>
                    <Button
                        onClick={onCreateStore}
                        className="bg-neutral-800! hover:bg-neutral-600!"
                        >
                        Create Your Store
                    </Button>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
