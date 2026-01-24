import React, { useState, useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/joy";
import { motion } from "framer-motion";
import Hero from "../admin(demo)/components/hero1";
import NewArrivalsSlider from "../admin(demo)/components/newArrivals";
import FeaturedPicksGrid from "../admin(demo)/components/featuredProducts";
import AllProducts from "../admin(demo)/components/allProducts";
import NewsletterSignup from "../admin(demo)/components/newsletter";
import Footer from "../admin(demo)/components/footer";
import StoreNotFound from "../../components/storenotfound";
import { Helmet } from "react-helmet-async";
import Header from "../admin(demo)/components/header"

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

function DemoHome({ storeSlug }) {
  const [storeData, setStoreData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const validateStore = async () => {
      try {
        setLoading(true);
        const API_URL =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
        const res = await fetch(`${API_URL}/api/stores/public/${storeSlug}`);
        const result = await res.json();

        if (!res.ok || !result.success) {
          setError(true);
        } else {
          setStoreData(result.data);
        }
      } catch (err) {
        console.error("Store Fetch Error:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (storeSlug) validateStore();
  }, [storeSlug]);

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
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress color="danger" thickness={4} />
        <Typography
          level="body-sm"
          sx={{ letterSpacing: "2px", fontWeight: 700 }}
        >
          LAYEMART
        </Typography>
      </Box>
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

  return (
    <div>
      <Helmet key={storeSlug} defer={false}>
        {/* Primary Meta */}
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />

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
        <Header storeName={storeData?.name} storeLogo={storeData?.logo?.url} />

        <Hero
          storeName={storeData?.name}
          storeLogo={storeData?.logo?.url}
          storeType={storeData?.storeType}
          storeHero={storeData?.heroImage?.url}
        />

        {/* Dynamic New Arrivals Heading passed via props if Slider supports it */}
        <NewArrivalsSlider subtitle={config.arrivalSub} />

        {/* Dynamic Marquee Section */}
        <Box
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
        </Box>

        <FeaturedPicksGrid storeType={storeData?.storeType} />

        <AllProducts />

        <NewsletterSignup storeType={storeData?.storeType} />

        <Footer storeName={storeData?.name} storeDescription={storeData?.description} storeLogo={storeData?.logo?.url} />
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
