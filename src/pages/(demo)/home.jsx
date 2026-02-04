import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/joy";
import { motion } from "framer-motion";
import Hero from "../admin(demo)/components/hero1";
import NewArrivalsSlider from "../admin(demo)/components/newArrivals";
import FeaturedPicksGrid from "../admin(demo)/components/featuredProducts";
import AllProducts from "../admin(demo)/components/allProducts";
// import NewsletterSignup from "../admin(demo)/components/newsletter";
import Footer from "../admin(demo)/components/footer";
import StoreNotFound from "../../components/storenotfound";
import { Helmet } from "react-helmet-async";
import Header from "../admin(demo)/components/header";
import { getSubdomain } from "../../../storeResolver";

// 1. Define Content Strategies for each Store Type
const STORE_CONTENT_CONFIG = {
  Fashion: {
    phrases: [
      "Wear Your Identity",
      "Bold Fits Only",
      "Street-Ready Essentials",
    ],
    arrivalSub: "Discover the latest ready-to-wear pieces.",
    emptyIcon: "👗",
  },
  Electronics: {
    phrases: ["Next-Gen Tech", "Power Your Future", "Innovation At Hand"],
    arrivalSub: "Upgrade your setup with our latest gadgets.",
    emptyIcon: "🔌",
  },
  "Beauty & Health": {
    phrases: ["Glow Naturally", "Self-Care Essentials", "Your Daily Ritual"],
    arrivalSub: "Discover curated beauty and wellness picks.",
    emptyIcon: "✨",
  },
  "Home & Garden": {
    phrases: [
      "Elevate Your Space",
      "Sustainable Living",
      "Design Your Sanctuary",
    ],
    arrivalSub: "New pieces for a house that feels like home.",
    emptyIcon: "🏡",
  },
  "Food & Groceries": {
    phrases: ["Freshly Sourced", "Organic & Healthy", "Farm to Table"],
    arrivalSub: "Stock your pantry with our newest arrivals.",
    emptyIcon: "🍎",
  },
  "Digital Products": {
    phrases: ["Instant Access", "Creative Assets", "Level Up Your Skills"],
    arrivalSub: "New tools to fuel your digital journey.",
    emptyIcon: "💻",
  },
  "General Store": {
    phrases: [
      "Quality Meets Value",
      "Your Daily Essentials",
      "Best Deals Daily",
    ],
    arrivalSub: "Explore our latest collection of essentials.",
    emptyIcon: "📦",
  },
};

function DemoHome({ storeSlug, resolverType }) {
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

useEffect(() => {
  const fetchStoreDetails = async () => {
    // 1. Resolve the identifier: Priority to prop/params, then subdomain
    const sub = getSubdomain();
    const identifier = storeSlug || sub;

    if (!identifier || identifier === 'www' || identifier === 'dashboard' || identifier === 'localhost') {
      setLoading(false);
      // You might want to redirect to the main Layemart landing page here
      return;
    }
    
    try {
      setLoading(true);
      setError(false);  
      const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      
      // Use the resolved identifier here
      const res = await fetch(`${API_URL}/api/stores/public/${identifier}`);
      const result = await res.json();

      if (res.ok && result.success) {
        setStoreData(result.data);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Fetch Error:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  fetchStoreDetails();
}, [storeSlug]); // It will also re-run if the component remounts on the new subdomain
  // 2. Determine content config based on storeType
  const config =
    STORE_CONTENT_CONFIG[storeData?.storeType] ||
    STORE_CONTENT_CONFIG["General Store"];
  const STORE_META_CONFIG = {
    Fashion: {
      description:
        "Shop trending fashion pieces, bold fits, and street-ready essentials.",
    },
    Electronics: {
      description:
        "Discover next-gen electronics, gadgets, and smart technology.",
    },
    "Beauty & Health": {
      description: "Curated beauty, wellness, and self-care essentials.",
    },
    "Home & Garden": {
      description:
        "Modern home and garden products designed for everyday living.",
    },
    "Food & Groceries": {
      description:
        "Fresh groceries, organic food, and daily essentials delivered.",
    },
    "Digital Products": {
      description:
        "Instant access to digital tools, assets, and creative resources.",
    },
    "General Store": {
      description:
        "Quality products, daily essentials, and great deals in one place.",
    },
  };

  if (loading && !localStorage.getItem("demo")) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white text-slate-900">
        {/* Top Loading Bar (Stripe-style) */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="fixed top-0 left-0 h-1 bg-red-500 z-50"
        />

        <div className="flex flex-col items-center gap-6">
          {/* Minimalist Logo Container */}
          <div className="relative flex items-center justify-center w-20 h-20">
            {/* Subtle Outer Glow */}
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute inset-0 bg-red-500 rounded-2xl blur-xl"
            />

            {/* Main Logo Icon */}
            <div className="relative w-16 h-16 bg-white border border-slate-100 rounded-2xl shadow-sm flex items-center justify-center">
              <span className="text-3xl font-black text-red-500 tracking-tighter">
                L
              </span>

              {/* Spinning Ring - Thin and elegant */}
              <div className="absolute inset-[-4px] border-2 border-transparent border-t-red-500/30 rounded-2xl animate-spin" />
            </div>
          </div>

          {/* Text Section */}
          <div className="text-center space-y-1">
            <h2 className="text-sm font-bold tracking-[0.2em] text-slate-400 uppercase">
              Laye<span className="text-slate-900">mart</span>
            </h2>
          </div>
        </div>

        {/* Footer Branding (Optional) */}
        <div className="absolute bottom-10 text-[10px] text-slate-300 font-medium tracking-widest uppercase">
          Secure Gateway
        </div>
      </div>
    );
  }
  const metaConfig =
    STORE_META_CONFIG[storeData?.storeType] ||
    STORE_META_CONFIG["General Store"];

  const pageTitle = storeData
    ? `${storeData.name.toUpperCase()} – ${storeData.storeType} | Layemart`
    : "Layemart Store";

  const pageDescription = storeData
    ? metaConfig.description
    : "Discover stores powered by Layemart";
  const pageImage = storeData?.logo?.url;
  const pageUrl = window.location.href;

  if (error) return <StoreNotFound />;

  const UnderConstructionState = ({ storeName, storeLogo }) => (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        px: 3,
        background: "linear-gradient(180deg, #fff 0%, #f9fafb 100%)",
      }}
    >
      {/* Store Identity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {storeLogo ? (
          <img
            src={storeLogo}
            alt={storeName}
            style={{ height: "60px", marginBottom: "16px" }}
          />
        ) : (
          <Typography level="h2" sx={{ mb: 1, fontWeight: 800, color: "#111" }}>
            {storeName?.toUpperCase()}
          </Typography>
        )}

        {/* Construction Visual */}
        <Box sx={{ position: "relative", my: 4 }}>
          <Typography
            sx={{
              fontSize: "5rem",
              filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.1))",
            }}
          >
            🏗️
          </Typography>
          <CircularProgress
            color="warning"
            size="lg"
            thickness={2}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              "--CircularProgress-size": "120px",
            }}
          />
        </Box>

        <Typography level="h3" sx={{ mb: 1, fontWeight: 700 }}>
          Coming Soon
        </Typography>
        <Typography
          level="body-lg"
          sx={{ color: "text.secondary", maxWidth: 500, mx: "auto", mb: 4 }}
        >
          We are currently building something amazing for you.{" "}
          <strong>{storeName}</strong> is putting on the finishing touches.
        </Typography>

        {/* Layemart Ad / Branding */}
        <Box
          sx={{
            pt: 4,
            borderTop: "1px solid",
            borderColor: "neutral.200",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography
            level="body-xs"
            sx={{
              letterSpacing: "1px",
              textTransform: "uppercase",
              color: "neutral.500",
            }}
          >
            Powered By
          </Typography>
          <Typography
            level="title-md"
            sx={{
              fontWeight: 900,
              color: "#ef4444", // Your branding color
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            LAYEMART{" "}
            <Box
              component="span"
              sx={{
                fontSize: "10px",
                px: 0.5,
                py: 0.2,
                bgcolor: "#ef4444",
                color: "#fff",
                borderRadius: "2px",
              }}
            >
              PRO
            </Box>
          </Typography>
          <Typography level="body-xs" sx={{ mt: 1 }}>
            Create your own professional store in minutes.
          </Typography>
        </Box>
      </motion.div>
    </Box>
  );

  if (storeData && storeData.isOnboarded === false) {
    return (
      <>
        <Helmet>
          <title>{storeData.name} | Coming Soon</title>
        </Helmet>
        <UnderConstructionState
          storeName={storeData.name}
          storeLogo={storeData.logo?.url}
        />
      </>
    );
  }
  return (
    <div>
      <Helmet key={storeSlug} defer={false}>
        {/* Primary Meta */}
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />


        {storeData?.logo?.url && (
          <link rel="icon" type="image/png" href={storeData.logo.url} />
        )}
        {/* SEO */}
        <link rel="canonical" href={pageUrl} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={pageUrl} />
        {pageImage && <meta property="og:image" content={pageImage} />}

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        {pageImage && <meta name="twitter:image" content={pageImage} />}
      </Helmet>

      <div>
        <Header
          storeName={storeData?.name}
          storeLogo={storeData?.logo?.url}
          storeSlug={storeSlug} // Pass the slug
          isStarter={storeData?.plan === "starter"} // Pass the plan check
        />

        <Hero
          storeName={storeData?.name}
          storeLogo={storeData?.logo?.url}
          storeType={storeData?.storeType}
          storeHero={storeData?.heroImage?.url}
          storeHeroSubtitle={storeData?.heroTitle}
          storeHeroTitle={storeData?.heroSubtitle}
        />

        {/* Dynamic New Arrivals Heading passed via props if Slider supports it */}
        <NewArrivalsSlider
          subtitle={config.arrivalSub}
          storeId={storeData?._id}
          storeSlug={storeSlug}
          isStarter={storeData?.plan === "starter"}
        />

        {/* Dynamic Marquee Section */}
        {/* <Box
          sx={{
            overflow: "hidden",
            backgroundColor: "neutral.50",
            py: 4,
            position: "relative",
          }}
        >
          <motion.div
            style={{ display: "flex", whiteSpace: "nowrap" }}
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          >
            {[...config.phrases, ...config.phrases].map((text, index) => (
              <Typography
                key={index}
                level="h4"
                sx={{
                  mx: 6,
                  fontWeight: 600,
                  fontSize: "1.5rem",
                  display: "inline-block",
                }}
              >
                <span style={{ color: "#ef4444" }}>*</span> {text}
              </Typography>
            ))}
          </motion.div>
        </Box> */}

        <FeaturedPicksGrid storeType={storeData?.storeType} isStarter={storeData?.plan === "starter"} storeSlug={storeSlug} />

        <AllProducts isStarter={storeData?.plan === "starter"} storeSlug={storeSlug}/>

        {/* <NewsletterSignup storeType={storeData?.storeType} /> */}

        <Footer
          storeName={storeData?.name}
          storeDescription={storeData?.description}
          storeLogo={storeData?.logo?.url}
          storeId={storeData?._id}
          isStarter={storeData?.plan === "starter"}
          storeSlug={storeSlug}

        />
      </div>
    </div>
  );
}

export default DemoHome;
const EmptyStoreState = ({ storeName }) => (
  <Box
    sx={{
      py: 10,
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 2,
    }}
  >
    <Box
      sx={{
        width: 80,
        height: 80,
        bgcolor: "neutral.100",
        borderRadius: "50%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mb: 1,
      }}
    >
      <Typography sx={{ fontSize: "2rem" }}>📦</Typography>
    </Box>
    <Typography level="h3" sx={{ fontWeight: 700 }}>
      Setting Up Shop
    </Typography>
    <Typography level="body-md" sx={{ color: "text.secondary", maxWidth: 400 }}>
      {storeName} is currently preparing their catalog. Check back soon to see
      our latest arrivals!
    </Typography>
  </Box>
);
