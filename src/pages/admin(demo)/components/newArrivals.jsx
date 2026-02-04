import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { ShoppingCartOutlined, Remove, Add } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { useProductStore } from "../../../../services/productService";
import { useCartStore } from "../../../../services/cartService";
import { useCustomerAuthStore } from "../../../store/useCustomerAuthStore";
import { motion } from "framer-motion";

const NewArrivalsGrid = ({ subtitle, storeSlug, isStarter }) => {
  const { products, fetchStoreProducts, setLocalProducts, loading } =
    useProductStore();
  const { cart, addToCart, updateQuantity, removeItem } = useCartStore();
  const { customer } = useCustomerAuthStore();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [processingId, setProcessingId] = useState(null);
  useEffect(() => {
    const initData = async () => {
      if (localStorage.getItem("demo")) {
      setLocalProducts(DUMMY_PRODUCTS);
      return;
      } else if (storeSlug) {
        setLocalProducts([]);
        await fetchStoreProducts(storeSlug);
      }
    };
    initData();
  }, [fetchStoreProducts, setLocalProducts, storeSlug]);

const getStorePath = (path) => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  // Check if we are physically on a subdomain right now
  const hostname = window.location.hostname;
  const isActuallySubdomain = hostname.split('.').length > 2 || 
    (hostname.includes('localhost') && hostname.split('.').length > 1 && !hostname.startsWith('localhost'));

  // If we are on a subdomain (Professional), NEVER prepend the slug
  if (isActuallySubdomain) {
    return cleanPath;
  }

  // Only prepend if we are on the main domain (Starter)
  return `/${storeSlug}${cleanPath}`;
};
  const getItemQty = (productId) => {
    const item = cart?.items?.find(
      (i) => i.product._id === productId || i.product === productId,
    );
    return item ? item.quantity : 0;
  };

  const handleCartAction = async (product, action) => {
    const productId = product._id || product.id;
    const targetStoreId = product.store || product.storeId;
    if (!customer) {
      navigate(getStorePath("/login"));
      return;
    }

    if (!targetStoreId) {
    console.error("Missing Store ID for product:", product);
    // If you don't have the ID on the product, you might need to find it 
    // from the storeSlug or a global store state.
    return;
  }
    // 1. Start Preloader
    setProcessingId(productId);

    try {
      const currentQty = getItemQty(productId);

      if (action === "increment") {
        if (currentQty === 0) {
          await addToCart(targetStoreId, productId, 1);
        } else {
          await updateQuantity(targetStoreId, productId, currentQty + 1);
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

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 10 }}>
        <CircularProgress color="inherit" />
      </Box>
    );

  return (
    <Box sx={{ maxWidth: "1440px", mx: "auto", p: { xs: 2, md: 4 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          fontWeight={800}
          sx={{ fontSize: { xs: 24, md: 30, lg: 34 }, letterSpacing: "-1.5px" }}
        >
          NEW ARRIVALS
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {subtitle || "The latest additions to our collection."}
        </Typography>
      </Box>

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
        {products.slice(0, 12).map((product) => (
          <motion.div
            key={product._id || product.id}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Box
              sx={{
                bgcolor: "white",
                borderRadius: 2,
                overflow: "hidden",
                position: "relative",
                // ⬇️ Updated Height
                height: "380px",
                display: "flex",
                flexDirection: "column",
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                transition: "0.3s",
                "&:hover": {
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                  transform: "translateY(-4px)",
                },
              }}
            >
              {/* Product Image Container */}
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  // ⬇️ Adjusted for a slightly taller rectangular image (3:4 ratio)
                  height: "220px",
                  overflow: "hidden",
                  bgcolor: "#f9f9f9",
                }}
              >
                <img
                  src={
                    product.images?.[0]?.url ||
                    product.image ||
                    "https://via.placeholder.com/400"
                  }
                  alt={product.name}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.5s",
                  }}
                />
              </Box>

              {/* Product Info - Flex-grow makes this fill remaining space */}
              <Box
                sx={{
                  p: 1.5,
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ display: "block", mb: 0.5 }}
                  >
                    {product.brand || "Brand"}
                  </Typography>
                  <Typography
                    variant="body2"
                    fontWeight={700}
                    noWrap
                    sx={{ mb: 0.5 }}
                  >
                    {product.name}
                  </Typography>

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="body2" fontWeight={800} color="black">
                      ₦{(product.price || 0).toLocaleString()}
                    </Typography>
                    <Button
                      size="small"
                      variant="text"
                      onClick={() => navigate(getStorePath(`/shop/product/${product._id}`))}
                      sx={{
                        fontSize: 11,
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

                {/* Add to Cart / Quantity Controls */}
                <div className="mt-3">
                  {getItemQty(product._id || product.id) === 0 ? (
                    <button
                      disabled={processingId === (product._id || product.id)}
                      onClick={() => handleCartAction(product, "increment")}
                      className="w-full bg-black text-white font-bold py-2 rounded hover:bg-gray-800 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
                    >
                      {processingId === (product._id || product.id) ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin-slow"></div>
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <ShoppingCartOutlined size={18} /> Add to Cart
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="flex items-center justify-between mt-1 gap-2 p-1 rounded-lg">
                      <button
                        disabled={processingId === (product._id || product.id)}
                        className="bg-gray-200 p-1.5 rounded hover:bg-gray-300 disabled:opacity-30 transition-opacity"
                        onClick={() => handleCartAction(product, "decrement")}
                      >
                        <Remove fontSize="small" />
                      </button>

                      <div className="flex flex-col items-center min-w-[30px]">
                        {processingId === (product._id || product.id) ? (
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin-slow"></div>
                        ) : (
                          <span className="font-bold text-lg">
                            {getItemQty(product._id || product.id)}
                          </span>
                        )}
                      </div>

                      <button
                        disabled={processingId === (product._id || product.id)}
                        className="bg-gray-200 p-1.5 rounded hover:bg-gray-300 disabled:opacity-30 transition-opacity"
                        onClick={() => handleCartAction(product, "increment")}
                      >
                        <Add fontSize="small" />
                      </button>
                    </div>
                  )}
                </div>
              </Box>
            </Box>
          </motion.div>
        ))}
      </Box>
    </Box>
  );
};

const DUMMY_PRODUCTS = [
  {
    id: 1,
    brand: "KOMONO",
    name: "TOTE BAG - VARIANT IMAGE SET",
    price: 142.5,
    isFeatured: true,
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=400",
  },
  {
    id: 2,
    brand: "CLOUDNOLA",
    name: "RIB AINE LS TOP - CHOCOLATE",
    price: 38.2,
    isFeatured: false,
    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=400",
  },
  {
    id: 3,
    brand: "MAJESTIC",
    name: "NORA JEANS - BLACK CORD",
    price: 52.0,
    isFeatured: true,
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=400",
  },
  {
    id: 4,
    brand: "KALEIDOSCOPE",
    name: "MANFRED WALLET - TOFFEE",
    price: 94.0,
    isFeatured: false,
    image:
      "https://images.unsplash.com/photo-1511405946472-a37e3b5ccd47?q=80&w=400",
  },
  {
    id: 5,
    brand: "KOMONO",
    name: "OVERSIZED TEE",
    price: 45.0,
    isFeatured: true,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=400",
  },
];

export default NewArrivalsGrid;
