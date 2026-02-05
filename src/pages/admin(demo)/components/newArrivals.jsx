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
import { Heart, Star } from "lucide-react";
import { toast } from "react-toastify";

const NewArrivalsGrid = ({ subtitle, storeSlug, isStarter, storeData }) => {
  const { products, fetchStoreProducts, setLocalProducts, loading } =
    useProductStore();
  const { cart, addToCart, updateQuantity, removeItem } = useCartStore();
  const { customer } = useCustomerAuthStore();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [processingId, setProcessingId] = useState(null);
  const [isWishlisted, setWishlisted] = useState(false);
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
    const cleanPath = path.startsWith("/") ? path : `/${path}`;

    // Check if we are physically on a subdomain right now
    const hostname = window.location.hostname;
    const isActuallySubdomain =
      hostname.split(".").length > 2 ||
      (hostname.includes("localhost") &&
        hostname.split(".").length > 1 &&
        !hostname.startsWith("localhost"));

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


  const handleToggleWishlist = async (productId) => {
    const { token, customer } = useCustomerAuthStore.getState();

    // Validate storeData existence
    if (!storeData?._id) {
      toast.error("Store context missing. Please refresh.", { containerId: "STOREFRONT" });
      return;
    }

    if (!customer || !token) {
      toast.info("Please log in to manage your wishlist", { containerId: "STOREFRONT" });
      navigate(`/${storeSlug}/login`); 
      return;
    }
    

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/products/wishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          storeId: storeData._id 
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error updating wishlist');

      // Use data.added (matching your backend) instead of data.active
      setWishlisted(data.added); 
      toast.success(data.message, { containerId: "STOREFRONT" });

    } catch (err) {
      toast.error(err.message, { containerId: "STOREFRONT" });
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
        className="md:grid-cols-2 lg:grid-cols-4 grid-cols-1"
        sx={{
          display: "grid",
          gap: 3,
        }}
      >
        {products.slice(0, 12).map((product) => (
          <motion.div
            key={product._id || product.id}
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-full max-w-100 mx-auto md:max-w-[390px] lg:max-w-[280px]" // ⬅️ Limits the card width
          >
            <Box
              sx={{
                bgcolor: "white",
                borderRadius: "1.2rem", // Slightly smaller radius for smaller card
                overflow: "hidden",
                height: "auto",
                display: "flex",
                flexDirection: "column",
                border: "1px solid #f2f2f2",
                p: 1.2, // ⬅️ Reduced padding
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": {
                  boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
                },
              }}
            >
              {/* Product Image Container */}
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: "180px", // ⬅️ Reduced height from 220px
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
                  "&:hover": {
                    transform: "scale(1.05)",
                  },
                }}
              />

              {/* Product Info */}
              <Box sx={{ mt: 1.5, px: 0.2, pb: 0.5 }}>
                <Typography
                  variant="body2" // ⬅️ Smaller text variant
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
                  gap={1}
                >
                  <Box sx={{ position: "relative" }}>
                    <IconButton
                      variant="plain" // Joy UI specific: removes the background box
                      onClick={() => handleToggleWishlist(product._id)}
                      sx={{
                        position: "absolute",
                        top: -8, // Adjust based on your card padding
                        zIndex: 2,
                        color: isWishlisted ? "#e11d48" : "#94a3b8", // Professional rose-red vs slate-gray
                        transition: "transform 0.2s ease",
                        "&:hover": { 
                          bgcolor: "transparent",
                          transform: "scale(1.1)",
                          color: isWishlisted ? "#be123c" : "#64748b" 
                        },
                      }}
                    >
                      <Heart
                        size={25} 
                        strokeWidth={2} 
                        fill={isWishlisted ? "currentColor" : "none"} // Fills the heart when active
                      />
                    </IconButton>
                  </Box>

                  {/* Compact Add Button */}
                  <div className="flex flex-col justify-end gap-3">
                    <Link
                      to={getStorePath(`/shop/product/${product._id}`)}
                      className="text-slate-800/90 text-[12px] underline text-end"
                    >
                      view more
                    </Link>
                    <div className="flex items-center justify-between w-full gap-3">
                      <Typography
                        variant="subtitle2" // ⬅️ Smaller price font
                        fontWeight={800}
                        sx={{ color: "#011B33", flexShrink: 0 }}
                      >
                        ₦{(product.price || 0).toLocaleString()}
                      </Typography>
                      {getItemQty(product._id || product.id) === 0 ? (
                        /* Initial "Add" Button */
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
                        /* +/- Stepper Controls */
                        <div
                          className="flex items-center gap-2 border border-gray-100 px-1 py-0.5 rounded-lg bg-gray-50/50"
                          onClick={(e) => e.stopPropagation()} // Prevent card navigation
                        >
                          <button
                            onClick={() =>
                              handleCartAction(product, "decrement")
                            }
                            className="p-1 hover:bg-white rounded-md transition-colors text-gray-500 flex items-center justify-center"
                          >
                            <Remove style={{ fontSize: 14 }} />
                          </button>

                          <span className="text-[12px] font-black text-gray-800 min-w-[12px] text-center">
                            {getItemQty(product._id || product.id)}
                          </span>

                          <button
                            onClick={() =>
                              handleCartAction(product, "increment")
                            }
                            className="p-1 hover:bg-white rounded-md transition-colors text-gray-500 flex items-center justify-center"
                          >
                            <Add style={{ fontSize: 14 }} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </Stack>
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
