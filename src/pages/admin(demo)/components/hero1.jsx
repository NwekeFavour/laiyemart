import React from 'react';
import { Button } from '@mui/joy';
import Header from './header';

// 1. Content Configuration for Hero
const HERO_CONTENT = {
  "Fashion": {
    headline: "Everyday essentials. Elevated style.",
    subtext: "Discover thoughtfully designed pieces made for comfort, confidence, and effortless everyday wear.",
    cta: "Refresh Your Wardrobe" // Specific to the feeling of getting new clothes
  },
  "Electronics": {
    headline: "Cutting-edge tech. Seamless living.",
    subtext: "Experience innovation with our curated selection of high-performance gadgets and smart home essentials.",
    cta: "Upgrade Your Tech" // Highlights the benefit of improvement
  },
  "Beauty & Health": {
    headline: "Radiant health. Natural beauty.",
    subtext: "Revitalize your routine with premium skincare and wellness products designed to make you glow.",
    cta: "Reveal Your Glow" // Emotional and results-oriented
  },
  "Home & Garden": {
    headline: "Design your space. Build your sanctuary.",
    subtext: "Transform your home with unique decor and gardening essentials that reflect your personal style.",
    cta: "Style Your Space" // Encourages creativity
  },
  "Food & Groceries": {
    headline: "Fresh flavors. Delivered to you.",
    subtext: "Quality ingredients and farm-fresh produce sourced daily for your kitchen and pantry.",
    cta: "Shop Fresh Daily" // Emphasizes quality and habit
  },
  "Digital Products": {
    headline: "Master your craft. Digital first.",
    subtext: "Instant access to premium assets, templates, and courses to accelerate your creative workflow.",
    cta: "Get Instant Access" // Highlights the "Digital" benefit of no shipping wait
  },
  "General Store": {
    headline: "Quality products. Better value.",
    subtext: "Find everything you need in one place, from daily essentials to unique finds across all categories.",
    cta: "Browse Best Sellers" // Social proof - "Best Sellers" are less overwhelming in a general store
  }
};

export default function Hero({ onCreateStore, storeName, storeLogo, storeType }) {
  // 2. Select the content based on storeType, fallback to General Store
  const content = HERO_CONTENT[storeType] || HERO_CONTENT["General Store"];

  return (
    <section className="hero">
      <div className="hero-content">
        <Header storeName={storeName} storeLogo={storeLogo} />

        <div className="flex items-center justify-center md:mt-16 mt-14 lg:mt-30 md:mx-10">
          <div>
            {/* Dynamic Headline */}
            <p className="m-0 text text-center lg:text-[30px] md:text-[18px] text-[16px] text-neutral-900 font-bold!">
              {content.headline}
            </p>

            {/* Dynamic Subtext */}
            <p className="mt-2 text-center text-neutral-800 md:mx-0 md:text-[16px]! text-[14px]! mx-1 font-light!">
              {content.subtext}
            </p>

            <div className="flex justify-center items-center mt-3">
              {/* Dynamic CTA Text */}
              <Button
                onClick={onCreateStore}
                className="bg-neutral-800! hover:bg-neutral-600! "
              >
                {content.cta}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}