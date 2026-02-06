import React from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Rating,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
const AllProductsSection = ({
  products,
  isStarter,
  storeSlug,
  storeData,
  toggleWishlist,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const { cart, addToCart, updateQuantity, removeItem } = useCartStore();
  const { customer } = useCustomerAuthStore();
  const navigate = useNavigate();
  const [processingId, setProcessingId] = useState(null);
  const getStorePath = (path) => {
    return isStarter ? `/${storeSlug}${path}` : path;
  };

  const getItemQty = (productId) => {
    const item = cart?.items?.find(
      (i) => i.product._id === productId || i.product === productId,
    );
    return item ? item.quantity : 0;
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

  if (!products || products.length === 0) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
            <ShoppingBagOutlined sx={{ fontSize: 32, color: "#9ca3af" }} />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            COLLECTION COMING SOON
          </h2>
          <p className="text-gray-500 mt-2 max-w-sm">
            We are currently curating our full catalog. Check back shortly to
            discover our premium range of clothing and accessories.
          </p>
        </div>
      </section>
    );
  }
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
            All Products
          </h2>
          <p className="text-gray-500 mt-2">
            Browse our full collection of premium clothing and accessories.
          </p>
        </div>

        {/* Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : isTablet
                ? "repeat(2,1fr)"
                : "repeat(4,1fr)",
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
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <Box
                  sx={{
                    bgcolor: "white",
                    borderRadius: "1.2rem", // Clean rounded corners
                    overflow: "hidden",
                    height: "auto", // Let it wrap naturally like Design 1
                    display: "flex",
                    flexDirection: "column",
                    border: "1px solid #f2f2f2",
                    p: 1.2, // Compact padding
                    cursor: "pointer",
                    transition: "0.3s",
                    "&:hover": {
                      boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                    },
                  }}
                >
                  {/* Image Section - Synced to Design 1 */}
                  <Box
                    sx={{
                      position: "relative",
                      width: "100%",
                      height: "180px", // Shorter, cleaner height
                      borderRadius: "1rem", // Inner radius
                      overflow: "hidden",
                      bgcolor: "#f7f7f7",
                      backgroundImage: `url(${mainImage})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      transition: "transform 0.5s ease",
                      "&:hover": { transform: "scale(1.05)" },
                    }}
                  />

                  {/* Info Section */}
                  <Box sx={{ mt: 1.5, px: 0.2 }}>
                    <Typography
                      variant="body2"
                      fontWeight={600}
                      sx={{
                        color: "#1a1a1a",
                        lineHeight: 1.3,
                        mb: 1.2,
                        height: "2.6em",
                        overflow: "hidden",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {product.name}
                    </Typography>

                    {/* Bottom Row: Rating, Price, and Actions */}
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-end"
                    >
                      {/* Left Side: Rating & Brand */}
                      <Box>
                        <IconButton
                          onClick={() => toggleWishlist(product._id, storeData._id)}
                          sx={{ color: product.star ? "#e11d48" : "#94a3b8" }}
                        >
                          <Heart fill={product.star ? "currentColor" : "none"} />
                        </IconButton>
                      </Box>

                      {/* Right Side: View More + Price/Add */}
                      <div className="flex flex-col items-end gap-2">
                        <Link
                          to={getStorePath(`/shop/product/${product._id}`)}
                          onClick={(e) => e.stopPropagation()}
                          className="text-gray-400 text-[10px] underline hover:text-black transition-colors"
                        >
                          view more
                        </Link>

                        <div className="flex items-center gap-2">
                          <Typography
                            variant="subtitle2"
                            fontWeight={800}
                            sx={{ color: "#011B33", fontSize: "13px" }}
                          >
                            ₦{(product.price || 0).toLocaleString()}
                          </Typography>

                          {qty === 0 ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCartAction(product, "increment");
                              }}
                              className="flex items-center gap-1 border border-gray-100 px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
                            >
                              <ShoppingCartOutlined
                                style={{ fontSize: 14 }}
                                className="text-gray-400"
                              />
                              <span className="text-[11px] font-bold text-gray-700">
                                Add
                              </span>
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

        {/* View All Button */}
        <div className="flex justify-center mt-10">
          <Link
            to={getStorePath("/shop")}
            className="px-8 py-3 bg-black text-white text-sm font-bold rounded-full hover:bg-neutral-800 transition shadow-lg"
          >
            VIEW ALL PRODUCTS
          </Link>
        </div>
      </div>
    </section>
  );
};

import { useEffect, useState } from "react";
import { useProductStore } from "../../../../services/productService";
import { getSubdomain } from "../../../../storeResolver";
import {
  Add,
  Remove,
  ShoppingBagOutlined,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "../../../../services/cartService";
import { useCustomerAuthStore } from "../../../store/useCustomerAuthStore";
import { Heart, Loader2, Star } from "lucide-react";
import { toast } from "react-toastify";

const DUMMY_PRODUCTS = [
  {
    id: 1,
    brand: "MAJESTIC",
    name: "RELAXED WOOL COAT",
    price: 180,
    colors: 2,
    image:
      "https://images.unsplash.com/photo-1620247405612-18f042ea68cf?q=80&w=388",
  },
  {
    id: 2,
    brand: "KOMONO",
    name: "MINIMAL LEATHER BELT",
    price: 55,
    colors: 3,
    image:
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=400",
  },
  {
    id: 3,
    brand: "CLOUDNOLA",
    name: "OVERSIZED KNIT SWEATER",
    price: 72,
    colors: 4,
    image:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=400",
  },
  {
    id: 4,
    brand: "KALEIDOSCOPE",
    name: "TAILORED TROUSERS",
    price: 98,
    colors: 2,
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=400",
  },
];

export default function AllProducts({
  isStarter,
  storeSlug,
  storeData,
  wishlist,
  toggleWishlist,
}) {
  const { fetchStoreProducts, setLocalProducts, products, loading } =
    useProductStore();
  const [displayProducts, setDisplayProducts] = useState([]);

  useEffect(() => {
    const initPage = async () => {
      const subdomain = getSubdomain();

      if (localStorage.getItem("demo")) {
        // Set Zustand store and local state with dummy data
        setLocalProducts(DUMMY_PRODUCTS);
        setDisplayProducts(DUMMY_PRODUCTS);
      } else {
        // Fetch from API for the specific store
        await fetchStoreProducts(subdomain);
      }
    };

    initPage();
  }, [fetchStoreProducts, setLocalProducts]);

  // Update local display state when Zustand products change
  useEffect(() => {
    if (products) {
      setDisplayProducts(products);
    }
  }, [products]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 10 }}>
        <CircularProgress color="inherit" />
      </Box>
    );
  }
  return (
    <AllProductsSection
      products={displayProducts}
      isStarter={isStarter}
      storeSlug={storeSlug}
      storeData={storeData}
      wishlist={wishlist}
      toggleWishlist={toggleWishlist}
    />
  );
}
