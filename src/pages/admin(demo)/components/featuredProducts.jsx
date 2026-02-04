import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Stack,
  Button,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Add,
  Remove,
  ShoppingBagOutlined,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { useProductStore } from "../../../../services/productService";
import { getSubdomain } from "../../../../storeResolver";
import { useCartStore } from "../../../../services/cartService";
import { Link } from "react-router-dom";
import { useCustomerAuthStore } from "../../../store/useCustomerAuthStore";
import { Star } from "lucide-react";

// 1. Define Content Mapping for Featured Section
const FEATURED_CONTENT = {
  Fashion: {
    title: "FEATURED PICKS",
    subtitle: "Hand-selected styles curated for everyday wear.",
  },
  Electronics: {
    title: "TOP TECH EDITS",
    subtitle: "Premium gadgets and electronics chosen for performance.",
  },
  "Beauty & Health": {
    title: "BEAUTY FAVORITES",
    subtitle: "The very best in skincare and wellness essentials.",
  },
  "Home & Garden": {
    title: "HOME HIGHLIGHTS",
    subtitle: "Curated pieces to elevate your living space.",
  },
  "Food & Groceries": {
    title: "FRESH PICKS",
    subtitle: "Our top-quality seasonal produce and pantry staples.",
  },
  "Digital Products": {
    title: "MOST POPULAR",
    subtitle: "Our highest-rated digital assets and tools.",
  },
  "General Store": {
    title: "FEATURED PICKS",
    subtitle: "Hand-selected items curated just for you.",
  },
};

const FeaturedPicksGrid = ({ storeType, storeSlug, isStarter }) => {
  const { fetchStoreProducts, setLocalProducts, products, loading } =
    useProductStore();
  const { customer } = useCustomerAuthStore();
  const { cart, addToCart, updateQuantity, removeItem } = useCartStore();

  const getStorePath = (path) => {
    return isStarter ? `/${storeSlug}${path}` : path;
  };

  const getItemQty = (productId) => {
    const item = cart?.items?.find(
      (i) => i.product._id === productId || i.product === productId,
    );
    return item ? item.quantity : 0;
  };
  const [processingId, setProcessingId] = useState(null);

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
  // 2. Select the correct text based on storeType
  const content =
    FEATURED_CONTENT[storeType] || FEATURED_CONTENT["General Store"];

  useEffect(() => {
    const initData = async () => {
      const subdomain = getSubdomain();

      if (localStorage.getItem("demo")) {
        setLocalProducts(DUMMY_FEATURED);
      } else {
        await fetchStoreProducts(subdomain);
      }
    };
    initData();
  }, [fetchStoreProducts, setLocalProducts]);

  const displayProducts = products
    .filter((p) => p.isFeatured === true)
    .slice(0, 8);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 10 }}>
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  if (!loading && displayProducts.length === 0) {
    return (
      <Box
        sx={{
          py: 10,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          m: 4,
        }}
      >
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <ShoppingBagOutlined sx={{ fontSize: 32, color: "#9ca3af" }} />
        </div>
        <Typography
          variant="h5"
          fontWeight="800"
          gutterBottom
          sx={{ letterSpacing: "-1px" }}
        >
          CURATING {content.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ maxWidth: 400 }}
        >
          We're hand-selecting our top pieces for this collection.
        </Typography>
      </Box>
    );
  }

  return (
    <section className="px-4 py-12 max-w-[1280px] mx-auto">
      <div className="mb-8 text-center md:text-left">
        <Typography
          className="lg:text-[34px]! md:text-[30px]! text-[26px]!"
          variant="h4"
          fontWeight="800"
          sx={{ letterSpacing: "-1.5px" }}
        >
          {content.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {content.subtitle}
        </Typography>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayProducts.map((product) => {
          const qty = getItemQty(product._id || product.id);

          return (
            <motion.div
              key={product._id || product.id}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="w-full max-w-100 mx-auto md:max-w-[390px] lg:max-w-[280px]"
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
                  "&:hover": {
                    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                  },
                }}
              >
                {/* Product Image Container - Synced to radius */}
                <Box
                  sx={{
                    position: "relative",
                    width: "100%",
                    height: "180px",
                    borderRadius: "1rem",
                    overflow: "hidden",
                    bgcolor: "#f7f7f7",
                    backgroundImage: `url(${
                      product.images?.[0]?.url ||
                      product.image ||
                      "https://via.placeholder.com/400"
                    })`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    transition: "transform 0.5s ease",
                  }}
                >
                  {product.isFeatured && (
                    <Box sx={{ position: "absolute", top: 8, left: 8 }}>
                      <Box
                        sx={{
                          bgcolor: "rgba(0,0,0,0.8)",
                          color: "white",
                          px: 1,
                          py: 0.3,
                          fontSize: "8px",
                          fontWeight: "bold",
                          borderRadius: "4px",
                          letterSpacing: "0.5px",
                        }}
                      >
                        FEATURED
                      </Box>
                    </Box>
                  )}
                </Box>

                {/* Product Info */}
                <Box sx={{ mt: 1.5, px: 0.2 }}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{
                      color: "#1a1a1a",
                      lineHeight: 1.3,
                      mb: 1.5,
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
                    alignItems="center"
                  >
                    {/* Rating Badge */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.4,
                        bgcolor: "#fbbd08",
                        px: 1,
                        py: 0.2,
                        borderRadius: "2rem",
                      }}
                    >
                      <Star style={{ fontSize: 10, color: "white" }} />
                    </Box>

                    {/* Price & Action Area */}
                    {/* Price & Action Area */}
                    <div className="flex flex-col items-end">
                      {/* Subtler View Details Link */}
                      <Link
                        to={getStorePath(`/shop/product/${product._id}`)}
                        className="text-slate-800/90 text-[12px] underline mb-3"
                      >
                        view more
                      </Link>

                      <div className="flex items-center gap-2">
                        <Typography
                          variant="subtitle2"
                          fontWeight={800}
                          sx={{ color: "#011B33", mr: 0.5 }}
                        >
                          ₦{(product.price || 0).toLocaleString()}
                        </Typography>

                        {qty === 0 ? (
                          <button
                            disabled={
                              processingId === (product._id || product.id)
                            }
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCartAction(product, "increment");
                            }}
                            className="flex items-center gap-1 border border-gray-100 px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
                          >
                            {processingId === (product._id || product.id) ? (
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
                          /* +/- Stepper Controls */
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
      </div>
    </section>
  );
};

const DUMMY_FEATURED = [
  {
    id: 101,
    brand: "MAJESTIC",
    name: "RELAXED WOOL COAT",
    price: 180000,
    colors: 2,
    isFeatured: true,
    image:
      "https://images.unsplash.com/photo-1620247405612-18f042ea68cf?q=80&w=400",
  },
  {
    id: 102,
    brand: "KOMONO",
    name: "MINIMAL LEATHER BELT",
    price: 55000,
    colors: 3,
    isFeatured: true,
    image:
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=400",
  },
  {
    id: 103,
    brand: "CLOUDNOLA",
    name: "OVERSIZED KNIT SWEATER",
    price: 72000,
    colors: 4,
    isFeatured: true,
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=400",
  },
  {
    id: 104,
    brand: "KALEIDOSCOPE",
    name: "TAILORED TROUSERS",
    price: 98000,
    colors: 2,
    isFeatured: true,
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=400",
  },
];

export default FeaturedPicksGrid;
