import React from 'react';
import { Button } from '@mui/joy';
import Header from './header';

export default function Hero({ onCreateStore, storeName }) {
  return (
    <section className="hero">
      <div className="hero-content">
        <Header />

        <div className="flex items-center justify-center md:mt-16 mt-14 lg:mt-30 md:mx-10">
          <div>
            <p className="m-0 text-center lg:text-[24px] md:text-[18px] text-[16px] text-neutral-900 text">
              Everyday essentials. Elevated style.
            </p>

            <p className="lg:mt-4 mt-2 text-center text-neutral-800 md:mx-0 md:text-[16px]! text-[14px]! mx-1 font-light!">
              Discover thoughtfully designed pieces made for comfort, confidence,
              and effortless everyday wear.
            </p>

            <div className="flex justify-center items-center mt-3">
              <Button
                onClick={onCreateStore}
                className="bg-neutral-800! hover:bg-neutral-600! " 
              >
                Shop the Collection
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
