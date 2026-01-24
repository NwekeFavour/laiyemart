import React from "react";
import { Button } from "@mui/joy";

// 1. Content Configuration for Hero
const HERO_CONTENT = {
  Fashion: {
    headline: "Everyday essentials. Elevated style.",
    subtext:
      "Discover thoughtfully designed pieces made for comfort, confidence, and effortless everyday wear.",
    cta: "Refresh Your Wardrobe", // Specific to the feeling of getting new clothes
  },
  Electronics: {
    headline: "Cutting-edge tech. Seamless living.",
    subtext:
      "Experience innovation with our curated selection of high-performance gadgets and smart home essentials.",
    cta: "Upgrade Your Tech", // Highlights the benefit of improvement
  },
  "Beauty & Health": {
    headline: "Radiant health. Natural beauty.",
    subtext:
      "Revitalize your routine with premium skincare and wellness products designed to make you glow.",
    cta: "Reveal Your Glow", // Emotional and results-oriented
  },
  "Home & Garden": {
    headline: "Design your space. Build your sanctuary.",
    subtext:
      "Transform your home with unique decor and gardening essentials that reflect your personal style.",
    cta: "Style Your Space", // Encourages creativity
  },
  "Food & Groceries": {
    headline: "Fresh flavors. Delivered to you.",
    subtext:
      "Quality ingredients and farm-fresh produce sourced daily for your kitchen and pantry.",
    cta: "Shop Fresh Daily", // Emphasizes quality and habit
  },
  "Digital Products": {
    headline: "Master your craft. Digital first.",
    subtext:
      "Instant access to premium assets, templates, and courses to accelerate your creative workflow.",
    cta: "Get Instant Access", // Highlights the "Digital" benefit of no shipping wait
  },
  "General Store": {
    headline: "Quality products. Better value.",
    subtext:
      "Find everything you need in one place, from daily essentials to unique finds across all categories.",
    cta: "Browse Best Sellers", // Social proof - "Best Sellers" are less overwhelming in a general store
  },
};

export default function Hero({ onCreateStore, storeName, storeLogo, storeType, storeHero }) {
  const content = HERO_CONTENT[storeType] || HERO_CONTENT["General Store"];

  const heroStyle = {
    position: 'relative',
    height: '100vh', // Full screen height for a dramatic look
    minHeight: '600px',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    backgroundColor: '#000',
  };

  const imageLayerStyle = {
    position: 'absolute',
    inset: 0,
    backgroundImage: `url(${storeHero})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: 1,
  };

  // The "Secret Sauce": A multi-layered gradient that protects the text 
  // without making the image look like it has a filter on it.
  const scrimLayerStyle = {
    position: 'absolute',
    inset: 0,
    background: `linear-gradient(to bottom, 
      rgba(0,0,0,0.4) 0%, 
      rgba(0,0,0,0.1) 40%, 
      rgba(0,0,0,0.6) 80%, 
      rgba(0,0,0,0.8) 100%)`,
    zIndex: 2,
  };

  return (
    <section style={storeHero ? heroStyle : {}} className={!storeHero ? "hero" : ""}>
      {storeHero && (
        <>
          <div style={imageLayerStyle} />
          <div style={scrimLayerStyle} />
        </>
      )}

      <div className="relative z-30 h-full flex flex-col">

        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center">
          {/* Headline: Thin tracking but heavy weight */}
          <h1 className={`
            max-w-5xl transition-all duration-1000 transform translate-y-0
            font-black! uppercase italic!
            lg:text-[80px] md:text-[60px] text-[40px] 
            leading-[0.9] tracking-tighter
            ${storeHero ? "text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.5)]" : "text-black"}
          `}>
            {content.headline}
          </h1>

          {/* Separator Line */}
          {storeHero && <div className="w-12 h-[2px] bg-white my-8" />}

          <p className={`
            max-w-xl font-medium! leading-relaxed
            md:text-[20px] text-[16px]
            ${storeHero ? "text-white/90" : "text-neutral-600"}
          `}>
            {content.subtext}
          </p>

          <div className="mt-12">
            <Button
              onClick={onCreateStore}
              size="lg"
              sx={{
                borderRadius: 0, // Sharp edges = High Fashion
                px: 6,
                py: 2,
                fontSize: '0.9rem',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                fontWeight: 900,
                border: storeHero ? '2px solid white' : '2px solid black',
                backgroundColor: storeHero ? 'transparent' : 'black',
                color: 'white',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'white',
                  color: 'black',
                  transform: 'scale(1.05)'
                }
              }}
            >
              {content.cta}
            </Button>
          </div>
        </div>

        {/* Floating Scroll Badge */}
        {storeHero && (
          <div className="pb-8 flex justify-center">
            <div className="text-white/50 text-[10px] tracking-[4px] uppercase font-bold animate-pulse">
              Scroll to explore
            </div>
          </div>
        )}
      </div>
    </section>
  );
}