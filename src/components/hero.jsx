import React from 'react';
import Header from './mainheader';
import { Button } from '@mui/joy';
import { ArrowRight } from 'lucide-react';
import { Card, Container } from '@mui/material';
import { CheckCircle2 } from "lucide-react";
import { copy } from '../../lib/copy';

export default function Hero({ onCreateStore }) {
  return (
    <section className="relative overflow-hidden bg-[#f3f4ff] lg:min-h-screen h-326 rounded-b-4xl">
      
      {/* Decorative Background Blobs */}
      <div className="absolute top-[-5%] left-[-5%] w-[45%] h-[45%] rounded-full bg-blue-200 blur-[120px] opacity-60"></div>
      <div className="absolute bottom-[5%] right-[-5%] w-[35%] h-[45%] rounded-full bg-indigo-200 blur-[130px] opacity-70"></div>

      <div className="hero-content relative z-10">
        <Header />

        <Container>
          <div className="flex flex-col lg:flex-row lg:items-center gap-10 lg:gap-16 pt-40 lg:pt-36">

            {/* Left Column: Text & CTAs */}
            <div className="flex-1">
              <p className="mb-2 inline-flex rounded-full bg-primary-100 leading-[40px] text-[32px]  md:text-[40px] font-bold! uppercase tracking-wide text-primary-800">
                Built for African SMes
              </p>

              <h1 className="text-h1 text-neutral-900 md:text-display font-bold md:font-black tracking-[-0.03em] leading-[1.05]">
                {copy.hero.heading.split('—')[0]} 
                <span className="block md:inline mt-1">
                  that <span className="relative inline-block">
                    <span className="relative z-10 italic text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-slate-400">
                      sell
                    </span>
                    <span className="absolute bottom-1 left-0 w-full h-[6px] bg-slate-100 -z-0 rounded-full md:hidden"></span>
                  </span>, without the hassle.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-body text-neutral-600 md:text-[18px] text-[16px] leading-relaxed">
                {copy.hero.subheading}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
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
                  {copy.ctas.primary}
                </Button>

                <Button
                  href="#how-it-works"
                  size="lg"
                  variant="outlined"
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 'xl',
                    borderColor: '#cbd5e1',
                    color: '#0f172a',
                    '&:hover': { backgroundColor: 'rgba(15,23,42,0.05)' },
                  }}
                >
                  {copy.ctas.secondary}
                </Button>
              </div>
            </div>

            {/* Right Column: Feature Card */}
            <Card
  className="relative flex-1 md:mb-0 mb-6 p-8 rounded-3xl bg-white shadow-xl overflow-hidden border border-neutral-200 transition-transform hover:-translate-y-2 hover:shadow-2xl"
>
  {/* Decorative top-left gradient circle */}
  <span className="absolute -top-5 -left-5 h-16 w-16 rounded-full bg-gradient-to-tr from-indigo-300 to-blue-200 opacity-30"></span>

  {/* Decorative bottom-right gradient blob */}
  <span className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-tr from-purple-200 to-indigo-100 opacity-20"></span>

  {/* Heading */}
  <h2 className="text-h3 text-neutral-900 mb-4 font-semibold">
    One clear system for your business
  </h2>

  {/* Description */}
  <p className="text-body text-neutral-600 mb-6 leading-relaxed">
    From store setup to payment confirmation and order tracking, Layemart keeps your selling process organized.
  </p>

  {/* Benefits List */}
  <ul className="space-y-3 text-small text-neutral-700">
    <li className="flex items-center gap-2">
      <CheckCircle2 className="h-5 w-5 text-[#4F46E5] flex-shrink-0" />
      No coding required
    </li>
    <li className="flex items-center gap-2">
      <CheckCircle2 className="h-5 w-5 text-[#4F46E5] flex-shrink-0" />
      No complicated setup
    </li>
    <li className="flex items-center gap-2">
      <CheckCircle2 className="h-5 w-5 text-[#4F46E5] flex-shrink-0" />
      Just sign up and start selling
    </li>
  </ul>
</Card>


          </div>

          {/* Proof Row */}
          <div className="">
            <ProofRow items={copy.proofRow} />
          </div>

        </Container>
      </div>
    </section>
  );
}

export const ProofRow = ({ items }) => {
  return (
    <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-4" aria-label="Layemart trust signals">
      {items.map((item) => (
        <li
          key={item}
          className="relative flex items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-small font-semibold text-neutral-700 shadow-sm overflow-hidden"
        >
          {/* Top-left decorative circle */}
          <span className="absolute -top-3 -left-3 h-6 w-6 rounded-full bg-[#4F46E5] opacity-20"></span>

          {/* Icon */}
          <CheckCircle2 className="h-5 w-5 text-[#4F46E5] z-10" aria-hidden="true" />

          {/* Text */}
          <span className="z-10">{item}</span>
        </li>
      ))}
    </ul>
  );
};