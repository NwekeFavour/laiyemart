import React, { useEffect, useState, useMemo } from "react";
import Header from "../admin(demo)/components/header";
import {
  Avatar,
  Input,
  Button,
  Stack,
  Typography,
  IconButton,
  Skeleton,
} from "@mui/joy";
import { motion } from "framer-motion";
import {
  Search,
  ShoppingCart,
  PackageSearch,
  Sparkles,
  Zap,
  Utensils,
  Tag,
  Heart,
  Home,
  Laptop,
  ShoppingBag,
  Star,
} from "lucide-react";
import { useProductStore } from "../../../services/productService";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCartStore } from "../../../services/cartService";
import { useCustomerAuthStore } from "../../store/useCustomerAuthStore";
import { Add, Remove, ShoppingCartOutlined } from "@mui/icons-material";
import Footer from "../admin(demo)/components/footer";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { getSubdomain } from "../../../storeResolver";
import { toast } from "react-toastify";

// --- CONTENT & THEME CONFIGURATION ---
const STORE_CONTENT_CONFIG = {
  Fashion: {
    phrases: [
      "Wear Your Identity",
      "Bold Fits Only",
      "Street-Ready Essentials",
    ],
    arrivalSub: "Discover the latest ready-to-wear pieces.",
    emptyIcon: "👗",
    primary: "danger",
    radius: "none", // Sharp look
    bg: "#ffffff",
    icon: <Sparkles size={18} />,
  },
  "Digital Products": {
    phrases: ["Instant Access", "Creative Assets", "Level Up Your Skills"],
    arrivalSub: "New tools to fuel your digital journey.",
    emptyIcon: "💻",
    primary: "primary",
    radius: "md",
    bg: "#f0f4f8",
    icon: <Laptop size={18} />,
  },
  Electronics: {
    phrases: ["Next-Gen Tech", "Power Your Future", "Innovation At Hand"],
    arrivalSub: "Upgrade your setup with our latest gadgets.",
    emptyIcon: "🔌",
    primary: "primary",
    radius: "md",
    bg: "#f8fafc",
    icon: <Zap size={18} />,
  },
  "Beauty & Health": {
    phrases: ["Glow Naturally", "Self-Care Essentials", "Your Daily Ritual"],
    arrivalSub: "Discover curated beauty and wellness picks.",
    emptyIcon: "✨",
    primary: "success",
    radius: "lg",
    bg: "#fffafa",
    icon: <Heart size={18} />,
  },
  "Home & Garden": {
    phrases: [
      "Elevate Your Space",
      "Sustainable Living",
      "Design Your Sanctuary",
    ],
    arrivalSub: "New pieces for a house that feels like home.",
    emptyIcon: "🏡",
    primary: "warning",
    radius: "xl",
    bg: "#fcfaf2",
    icon: <Home size={18} />,
  },
  "Food & Groceries": {
    phrases: ["Freshly Sourced", "Organic & Healthy", "Farm to Table"],
    arrivalSub: "Stock your pantry with our newest arrivals.",
    emptyIcon: "🍎",
    primary: "warning",
    radius: "xl",
    bg: "#fffaf0",
    icon: <Utensils size={18} />,
  },
  "General Store": {
    phrases: [
      "Quality Meets Value",
      "Your Daily Essentials",
      "Best Deals Daily",
    ],
    arrivalSub: "Explore our latest collection of essentials.",
    emptyIcon: "📦",
    primary: "neutral",
    radius: "22px",
    bg: "#f8fafc",
    icon: <ShoppingBag size={18} />,
  },
};

function Products({ storeSlug, isStarter }) {
  const [storeData, setStoreData] = useState(null);
  const theme = useTheme();
  const token = useCustomerAuthStore.getState();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [storeLoading, setStoreLoading] = useState(true);
  const [storeError, setStoreError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { cart, addToCart, updateQuantity, removeItem } = useCartStore();
  const { customer } = useCustomerAuthStore();
  const location = useLocation();
  const [processingId, setProcessingId] = useState(null);
  const {
    toggleStar,
    products,
    loading: productsLoading,
    fetchStoreProducts,
  } = useProductStore();
  const subdomain = getSubdomain();

  const navigate = useNavigate();
  const getItemQty = (productId) => {
    const item = cart?.items?.find(
      (i) => i.product._id === productId || i.product === productId,
    );
    return item ? item.quantity : 0;
  };

  const getStorePath = (path) => {
    return isStarter ? `/${storeSlug}${path}` : path;
  };
  const handleCartAction = async (product, action) => {
    const productId = product._id || product.id;

    if (!customer) {
      navigate(getStorePath("/login"));
      return;
    }

    // 1. Start Preloader
    setProcessingId(productId);

    try {
      const currentQty = getItemQty(productId);

      if (action === "increment") {
        if (currentQty === 0) {
          await addToCart(product.store, productId, 1);
        } else {
          await updateQuantity(product.store, productId, currentQty + 1);
        }
      } else if (action === "decrement") {
        if (currentQty === 1) {
          await removeItem(product.store, productId);
        } else {
          await updateQuantity(product.store, productId, currentQty - 1);
        }
      }
    } catch (error) {
      console.error("Cart update failed", error);
    } finally {
      // 2. Stop Preloader - This runs for BOTH increment and decrement
      setProcessingId(null);
    }
  };

  useEffect(() => {
    if (location.state?.selectedCategory) {
      setSelectedCategory(location.state.selectedCategory);

      // Optional: Clear the state so refreshing doesn't keep the filter locked
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  // Determine current config based on store industry/type
  const config = useMemo(() => {
    return (
      STORE_CONTENT_CONFIG[storeData?.storeType] ||
      STORE_CONTENT_CONFIG["General Store"]
    );
  }, [storeData]);

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
  // Pick a random phrase for the hero sub-header
  const slogan = useMemo(() => {
    if (!config) return "";
    return config.phrases[Math.floor(Math.random() * config.phrases.length)];
  }, [config]);

  useEffect(() => {
    const fetchStoreInfo = async () => {
      if (!storeSlug) return;

      try {
        setStoreLoading(true);
        const API_URL =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
        const res = await fetch(`${API_URL}/api/stores/public/${storeSlug}`);
        const result = await res.json();

        if (res.ok && result.success) {
          setStoreData(result.data);
        } else {
          setStoreError(true);
        }
      } catch (err) {
        console.error("Shop Data Fetch Error:", err);
        setStoreError(true);
      } finally {
        setStoreLoading(false);
      }
    };

    fetchStoreInfo();
  }, [storeSlug]); // Removed window.location.hostname to prevent unnecessary re-runs

  useEffect(() => {
    if (storeSlug) fetchStoreProducts(storeSlug);
  }, [storeSlug]);

  const categories = useMemo(() => {
    const names = products.map((p) => p.category?.name).filter(Boolean);
    return ["All", ...new Set(names)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCat =
        selectedCategory === "All" || p.category?.name === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [products, searchQuery, selectedCategory]);

  if (storeError)
    return (
      <div className="text-center py-20 font-bold text-slate-500">
        Store not found
      </div>
    );

  const HeroSkeleton = () => (
    <div className="md:mt-4 mt-3 max-w-5xl mx-auto w-full py-8 bg-white shadow-sm lg:rounded-xl border border-slate-100 md:py-12">
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-start md:ml-12 gap-6">
        <Skeleton variant="circular" width={140} height={140} />

        <div className="flex flex-col gap-2 items-center md:items-start">
          <Skeleton variant="text" width={250} height={40} />

          <Skeleton variant="text" width={180} height={20} />
        </div>
      </div>
    </div>
  );

  // 1. Calculate everything inside a single useMemo so it only updates when storeData is ready
  const seoData = useMemo(() => {
    const type = storeData?.storeType || "General Store";
    const name = storeData?.name || "Store";

    // Get the industry-specific description
    const industryDesc =
      STORE_META_CONFIG[type]?.description ||
      STORE_META_CONFIG["General Store"].description;

    return {
      title: storeData
        ? `${name} – Official ${type} Store | Layemart`
        : "Loading Store... | Layemart",
      description: storeData
        ? `${industryDesc} Discover quality products at ${name}.`
        : "Discover stores powered by Layemart.",
      image: storeData?.logo?.url || "https://yourdomain.com/default-share.jpg",
      url: window.location.href,
      type: type,
    };
  }, [storeData]); // This ensures the metadata RE-CALCULATES the moment storeData arrives

  return (
    <div>
      <Helmet key={storeData?._id || "loading"} defer={false}>
        {/* Primary Meta Tags */}
        <title>{seoData.title}</title>
        <meta name="description" content={seoData.description} />
        <link rel="canonical" href={seoData.url} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={seoData.url} />
        <meta property="og:title" content={seoData.title} />
        <meta property="og:description" content={seoData.description} />
        <meta property="og:image" content={seoData.image} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoData.title} />
        <meta name="twitter:description" content={seoData.description} />
        <meta name="twitter:image" content={seoData.image} />

        {/* JSON-LD Structured Data for Google Search */}
        {storeData && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "OnlineStore",
              name: storeData.name,
              description: seoData.description,
              url: seoData.url,
              logo: seoData.image,
              category: seoData.type,
            })}
          </script>
        )}
      </Helmet>

      <div
        style={{ backgroundColor: config.bg }}
        className="min-h-screen pb-20 transition-colors duration-500"
      >
        <Header
          storeData={storeData}
          storeName={storeData?.name}
          storeLogo={storeData?.logo?.url}
          storeSlug={storeSlug} // Pass the slug
          isStarter={storeData?.plan === "starter"} // Pass the plan check
        />

        {/* --- HERO SECTION --- */}
        {storeLoading ? (
          <HeroSkeleton />
        ) : (
          <div className="md:mt-6 mt-3  max-w-6xl mx-auto px-4 lg:px-0">
            <div className="bg-white border border-slate-100 shadow-sm rounded-2xl md:rounded-3xl overflow-hidden">
              <div className="p-6 md:p-10 flex flex-col md:flex-row items-center gap-6">
                <div className="shrink-0 bg-slate-50 rounded-full border border-slate-100 flex items-center justify-center p-2">
                  <Avatar
                    src={storeData?.logo?.url}
                    alt={storeData?.name}
                    sx={{
                      width: 130,
                      height: 130,
                      boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                    }}
                  />
                </div>

                <div className="text-center md:text-left">
                  <Typography
                    level="body-xs"
                    fontWeight="800"
                    sx={{
                      letterSpacing: "1px",
                      color: `${config.primary}.600`,
                      mb: 0.5,
                    }}
                  >
                    {slogan}
                  </Typography>
                  <h1 className="text-[28px] md:text-[42px] font-bold! text-slate-900 leading-tight capitalize">
                    {storeData?.name}
                  </h1>
                  <p className="text-slate-500 text-sm md:text-base mt-2">
                    {config.arrivalSub} Guaranteed by{" "}
                    <span className="font-bold text-slate-700">Layemart.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-6xl mx-auto px-4 mt-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <Stack
              direction="row"
              spacing={1}
              sx={{
                overflowX: "auto",
                py: 1,
                "&::-webkit-scrollbar": { display: "none" },
              }}
            >
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "solid" : "soft"}
                  color={config.primary}
                  onClick={() => setSelectedCategory(cat)}
                  sx={{
                    borderRadius: config.radius,
                    whiteSpace: "nowrap",
                    px: 3,
                  }}
                >
                  {cat}
                </Button>
              ))}
            </Stack>

            <Input
              placeholder={`Search in ${storeData?.name || "store"}...`}
              startDecorator={<Search size={18} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ width: { md: "320px" }, borderRadius: config.radius }}
            />
          </div>

          {/* --- PRODUCTS GRID --- */}
          <div className="mt-6">
            {productsLoading ? (
              Array.from(new Array(8)).map((_, i) => (
                <div
                  key={i}
                  className="h-72 bg-gray-200 animate-pulse rounded-lg"
                ></div>
              ))
            ) : filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-24 opacity-60">
                <div className="text-7xl mb-4">{config.emptyIcon}</div>
                <Typography level="h4" fontWeight="800">
                  No treasures found
                </Typography>
                <Typography level="body-sm">
                  Try searching for something else or changing categories.
                </Typography>
              </div>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr", // 1 column on mobile
                    sm: "repeat(2, 1fr)", // 2 columns on tablets
                    md: "repeat(4, 1fr)", // 4 columns on desktop
                  },
                  gap: 3,
                }}
              >
                {products.slice(0, 12).map((product) => {
                  const qty = getItemQty(product._id || product.id);
                  const mainImage =
                    product.images?.[0]?.url ||
                    product.image ||
                    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400";

                  return (
                    <motion.div
                      key={product._id || product.id}
                      whileHover={{ scale: 1.02 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                      className="w-full max-w-100 mx-auto md:max-w-97.5 lg:max-w-70"
                    >
                      <Box
                        sx={{
                          bgcolor: "white",
                          borderRadius: "1.2rem",
                          overflow: "hidden",
                          display: "flex",
                          flexDirection: "column",
                          border: "1px solid #f2f2f2",
                          p: 1.2,
                          cursor: "pointer",
                          transition: "0.3s",
                          position: "relative",
                          "&:hover": {
                            boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                          },
                        }}
                      >
                        {/* Image Container - Strictly matching Design 1 */}
                        <Box
                          sx={{
                            width: "100%",
                            height: "180px",
                            borderRadius: "1rem",
                            overflow: "hidden",
                            bgcolor: "#f7f7f7",
                            position: "relative",
                          }}
                        >
                          <img
                            src={mainImage}
                            alt={product.name}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "transform 0.5s ease",
                            }}
                            className="hover:scale-105"
                          />
                        </Box>

                        {/* Info Section */}
                        <Box sx={{ mt: 1.5, px: 0.2 }}>
                          <Typography
                            variant="body2"
                            fontWeight={600}
                            sx={{
                              color: "#1a1a1a",
                              lineHeight: 1.3,
                              mb: 1,
                              height: "2.6em",
                              overflow: "hidden",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {product.name}
                          </Typography>

                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="flex-end"
                          >
                            {/* Left: Rating & Price */}
                            <Box>
                              <IconButton
                                sx={{ color: product.star ? "#e11d48" : "#94a3b8" }}
                                onClick={() =>
                                  toggleStar(product._id, storeData._id)
                                }
                              >
                                <Heart
                                  fill={product.star ? "currentColor" : "none"}
                                />
                              </IconButton>
                            </Box>

                            {/* Right: View More & Action */}
                            <div className="flex flex-col items-end gap-2">
                              <Link
                                to={getStorePath(
                                  `/shop/product/${product._id}`,
                                )}
                                onClick={(e) => e.stopPropagation()}
                                className="text-gray-400 text-[10px] decoration-inherit decoration-solid underline hover:text-black transition-colors"
                              >
                                view more
                              </Link>

                              <div className="flex items-center gap-3">
                                <Typography
                                  variant="subtitle2"
                                  fontWeight={800}
                                  sx={{ color: "#011B33", fontSize: "13px" }}
                                >
                                  ₦{(product.price || 0).toLocaleString()}
                                </Typography>
                                {qty === 0 ? (
                                  <button
                                    disabled={
                                      processingId ===
                                      (product._id || product.id)
                                    }
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCartAction(product, "increment");
                                    }}
                                    className="flex items-center gap-1 border border-gray-100 px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                                  >
                                    {processingId ===
                                    (product._id || product.id) ? (
                                      <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                      <>
                                        <ShoppingCartOutlined
                                          style={{ fontSize: 14 }}
                                          className="text-gray-400"
                                        />
                                        <span className="text-[11px] font-bold text-gray-700">
                                          Add
                                        </span>
                                      </>
                                    )}
                                  </button>
                                ) : (
                                  <div
                                    className="flex items-center gap-2 border border-gray-100 px-1 py-0.5 rounded-lg bg-gray-50/50"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <button
                                      onClick={() =>
                                        handleCartAction(product, "decrement")
                                      }
                                      className="p-1 hover:bg-white rounded-md transition-colors text-gray-500"
                                    >
                                      <Remove style={{ fontSize: 12 }} />
                                    </button>
                                    <span className="text-[11px] font-black text-gray-800 min-w-[12px] text-center">
                                      {qty}
                                    </span>
                                    <button
                                      onClick={() =>
                                        handleCartAction(product, "increment")
                                      }
                                      className="p-1 hover:bg-white rounded-md transition-colors text-gray-500"
                                    >
                                      <Add style={{ fontSize: 12 }} />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Stack>
                        </Box>
                      </Box>
                    </motion.div>
                  );
                })}
              </Box>
            )}
          </div>
        </div>
      </div>
      <Footer
        storeName={storeData?.name}
        storeDescription={storeData?.description}
        storeLogo={storeData?.logo?.url}
        storeId={storeData?._id}
        isStarter={storeData?.plan === "starter"}
        storeSlug={storeSlug}
      />
    </div>
  );
}

export default Products;
