import React from "react";
import {
  Box,
  Button,
  IconButton,
  Rating,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
const AllProductsSection = ({ products }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const { cart, addToCart, updateQuantity, removeItem } = useCartStore();
  const { customer } = useCustomerAuthStore();
  const navigate = useNavigate();
  const [processingId, setProcessingId] = useState(null);
  const getItemQty = (productId) => {
    const item = cart?.items?.find(
      (i) => i.product._id === productId || i.product === productId,
    );
    return item ? item.quantity : 0;
  };
  const handleCartAction = async (product, action) => {
    const productId = product._id || product.id;

    if (!customer) {
      navigate("/login");
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
            const mainImage =
              product.images?.[0]?.url ||
              product.image ||
              "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400";

            return (
              <motion.div
                key={product._id || product.id}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.25 }}
              >
                <Box
                  sx={{
                    bgcolor: "white",
                    borderRadius: 2,
                    overflow: "hidden",
                    position: "relative",
                    cursor: "pointer",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                    transition: "0.3s",
                    // ⬇️ New Flex logic to control vertical space
                    height: "380px",
                    display: "flex",
                    flexDirection: "column",
                    "&:hover": {
                      boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                      "& img": { transform: "scale(1.05)" },
                    },
                  }}
                >
                  {/* Image Section - Fixed Height */}
                  <Box
                    sx={{
                      width: "100%",
                      height: 280, // Fixed height for image
                      overflow: "hidden",
                      bgcolor: "#f5f5f5",
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
                        transition: "transform 0.4s",
                      }}
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400";
                      }}
                    />
                  </Box>

                  {/* Info & Actions - Flex Grow fills the remaining card height */}
                  <Box
                    sx={{
                      p: 2,
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box>
                      <Typography
                        sx={{
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: 1,
                          color: "text.secondary",
                          mb: 0.5,
                        }}
                      >
                        {product.brand || "Collection"}
                      </Typography>

                      <Typography
                        sx={{
                          fontSize: 14,
                          fontWeight: 700,
                          color: "text.primary",
                          display: "-webkit-box",
                          WebkitLineClamp: 2, // Allow up to 2 lines of text
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          mb: 1,
                        }}
                      >
                        {product.name}
                      </Typography>

                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography variant="body2" fontWeight={800}>
                          ₦{(product.price || 0).toLocaleString()}
                        </Typography>
                        <Button
                          size="small"
                          variant="text"
                          onClick={(e) => {
                            e.stopPropagation(); // Stop navigation click
                            navigate(`/shop/product/${product._id}`);
                          }}
                          sx={{
                            fontSize: 12,
                            color: "#02489b",
                            textTransform: "none",
                            minWidth: 0,
                            p: 0,
                          }}
                        >
                          View Details
                        </Button>
                      </Stack>
                    </Box>

                    {/* Add to Cart / Quantity - Always at the bottom */}
                    <Box sx={{ mt: 2 }}>
                      {getItemQty(product._id || product.id) === 0 ? (
                        <button
                          disabled={
                            processingId === (product._id || product.id)
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCartAction(product, "increment");
                          }}
                          className="w-full bg-black text-white font-bold py-2 rounded hover:bg-gray-800 flex items-center justify-center gap-2 disabled:cursor-not-allowed transition-colors"
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
                        <div className="flex items-center justify-between gap-2 p-1 bg-gray-50 rounded-lg">
                          <button
                            className="bg-gray-200 p-1.5 rounded hover:bg-gray-300 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCartAction(product, "decrement");
                            }}
                          >
                            <Remove fontSize="small" />
                          </button>

                          <div className="font-bold text-lg">
                            {processingId === (product._id || product.id) ? (
                              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              getItemQty(product._id || product.id)
                            )}
                          </div>

                          <button
                            className="bg-gray-200 p-1.5 rounded hover:bg-gray-300 transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCartAction(product, "increment");
                            }}
                          >
                            <Add fontSize="small" />
                          </button>
                        </div>
                      )}
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            );
          })}
        </Box>

        {/* View All Button */}
        <div className="flex justify-center mt-10">
          <Link
            to={"/shop"}
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

export default function AllProducts() {
  const { fetchStoreProducts, setLocalProducts, products, loading } =
    useProductStore();
  const [displayProducts, setDisplayProducts] = useState([]);

  useEffect(() => {
    const initPage = async () => {
      const isDemo = localStorage.getItem("demo") === "true";
      const subdomain = getSubdomain();

      if (isDemo || !subdomain) {
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

  if (loading)
    return <div className="py-20 text-center">Loading collection...</div>;

  return <AllProductsSection products={displayProducts} />;
}
