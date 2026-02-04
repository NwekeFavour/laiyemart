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
} from "lucide-react";
import { useProductStore } from "../../../services/productService";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import { useCartStore } from "../../../services/cartService";
import { useCustomerAuthStore } from "../../store/useCustomerAuthStore";
import { Add, Remove, ShoppingCartOutlined } from "@mui/icons-material";
import Footer from "../admin(demo)/components/footer";

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
  const [storeLoading, setStoreLoading] = useState(true);
  const [storeError, setStoreError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { cart, addToCart, updateQuantity, removeItem } = useCartStore();
  const { customer } = useCustomerAuthStore();
  const location = useLocation();
  const [processingId, setProcessingId] = useState(null);
  const {
    products,
    loading: productsLoading,
    fetchStoreProducts,
  } = useProductStore();
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
  }, [storeSlug, fetchStoreProducts]);

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
              <div className="bg-slate-900 py-2 px-6 flex justify-between items-center">
                <span className="text-[10px] md:text-xs font-bold text-white tracking-widest uppercase flex items-center gap-2">
                  {config.icon} Official {storeData?.storeType}
                </span>
                <span className="text-[10px] md:text-xs font-medium text-slate-400">
                  Powered by{" "}
                  <span className="text-white font-bold">Layemart</span>
                </span>
              </div>

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              filteredProducts.map((product) => (
                <div
                  key={product._id || product.id}
                  className="group relative cursor-pointer rounded-lg overflow-hidden bg-white shadow-md transition-all duration-300 hover:shadow-xl flex flex-col"
                  style={{ width: "100%", height: "380px" }} // 1. Fixed total card height
                  onClick={() => navigate(`/shop/product/${product._id}`)}
                >
                  {/* Product Image Section - Fixed Height */}
                  <div
                    className="relative overflow-hidden bg-gray-100"
                    style={{ height: "240px" }}
                  >
                    <img
                      src={
                        product.images?.[0]?.url ||
                        product.image ||
                        "https://via.placeholder.com/400"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />

                    {/* Featured Badge */}
                    {product.isFeatured && (
                      <div className="absolute top-3 left-3 bg-black text-white px-2 py-0.5 text-[10px] font-bold rounded-sm tracking-wide z-10">
                        FEATURED
                      </div>
                    )}
                  </div>

                  {/* Product Info - Flex Grow pushes button to bottom */}
                  <div className="p-4 flex flex-col flex-grow justify-between">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                        {product.brand || "OFFICIAL"}
                      </span>
                      <h3 className="text-sm font-bold line-clamp-2 text-gray-800 h-10">
                        {product.name}
                      </h3>
                      <span className="text-base font-extrabold text-black mt-1">
                        ₦{(product.price || 0).toLocaleString()}
                      </span>
                    </div>

                    {/* Add to Cart / Quantity Controls - Always stays at the bottom */}
                    <div className="mt-auto pt-3">
                      {getItemQty(product._id || product.id) === 0 ? (
                        <button
                          disabled={
                            processingId === (product._id || product.id)
                          }
                          onClick={(e) => {
                            e.stopPropagation(); // 2. Stop card click navigation
                            handleCartAction(product, "increment");
                          }}
                          className="w-full bg-black text-white text-sm font-bold py-2.5 rounded hover:bg-gray-800 flex items-center justify-center gap-2 disabled:cursor-not-allowed transition-colors"
                        >
                          {processingId === (product._id || product.id) ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <>
                              <ShoppingCartOutlined sx={{ fontSize: 18 }} /> Add
                              to Cart
                            </>
                          )}
                        </button>
                      ) : (
                        <div
                          className="flex items-center justify-between gap-2 bg-gray-50 p-1 rounded-lg border"
                          onClick={(e) => e.stopPropagation()} // 3. Prevent navigation when clicking controls
                        >
                          <button
                            disabled={
                              processingId === (product._id || product.id)
                            }
                            className="bg-gray-200 p-1.5 rounded hover:bg-gray-300 disabled:opacity-30 transition-opacity"
                            onClick={() =>
                              handleCartAction(product, "decrement")
                            }
                          >
                            <Remove fontSize="small" />
                          </button>

                          <div className="flex flex-col items-center min-w-[30px]">
                            {processingId === (product._id || product.id) ? (
                              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <span className="font-bold text-lg text-gray-900">
                                {getItemQty(product._id || product.id)}
                              </span>
                            )}
                          </div>

                          <button
                            disabled={
                              processingId === (product._id || product.id)
                            }
                            className="bg-gray-200 p-1.5 rounded hover:bg-gray-300 disabled:opacity-30 transition-opacity"
                            onClick={() =>
                              handleCartAction(product, "increment")
                            }
                          >
                            <Add fontSize="small" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
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
