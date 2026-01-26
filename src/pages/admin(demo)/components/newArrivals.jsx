import React, { useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
import { useProductStore } from "../../../../services/productService";
import { useCartStore } from "../../../../services/cartService";
import { useCustomerAuthStore } from "../../../store/useCustomerAuthStore";
import { motion } from "framer-motion";

const NewArrivalsGrid = ({ subtitle }) => {
  const { products, fetchStoreProducts, setLocalProducts, loading } =
    useProductStore();
  const { cart, addToCart, updateQuantity, removeItem } = useCartStore();
  const { customer } = useCustomerAuthStore();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));

  useEffect(() => {
    const initData = async () => {
      const isDemo = localStorage.getItem("demo") === "true";
      if (isDemo) setLocalProducts(DUMMY_PRODUCTS);
      else await fetchStoreProducts();
    };
    initData();
  }, [fetchStoreProducts, setLocalProducts]);

  const getItemQty = (productId) => {
    const item = cart?.items?.find(
      (i) => i.product._id === productId || i.product === productId,
    );
    return item ? item.quantity : 0;
  };

  const handleCartAction = (product, action) => {
    const currentQty = getItemQty(product._id);
    if (!customer) {
      navigate("/login");
      return;
    }
    if (action === "increment") {
      currentQty === 0
        ? addToCart(product.store, product._id, 1)
        : updateQuantity(product.store, product._id, currentQty + 1);
    } else if (action === "decrement") {
      currentQty === 1
        ? removeItem(product.store, product._id)
        : updateQuantity(product.store, product._id, currentQty - 1);
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
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                transition: "0.3s",
              }}
            >
              {/* Product Image */}
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: 0,
                  paddingTop: "100%",
                  overflow: "hidden",
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

              {/* Product Info */}
              <Box sx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  {product.brand}
                </Typography>
                <Typography variant="body2" fontWeight={700} noWrap>
                  {product.name}
                </Typography>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={1}
                >
                  <Typography variant="body2" fontWeight={800}>
                    ₦{(product.price || 0).toLocaleString()}
                  </Typography>
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => navigate(`/product/${product._id}`)}
                    sx={{
                      fontSize: 12,
                      color: "#02489b",
                      textTransform: "none",
                    }}
                  >
                    View Details
                  </Button>
                </Stack>

                {/* Add to Cart / Quantity Controls */}
                <Box sx={{ mt: 2 }}>
                  {getItemQty(product._id || product.id) === 0 ? (
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<ShoppingCartOutlined />}
                      onClick={() => handleCartAction(product, "increment")}
                      sx={{
                        bgcolor: "black",
                        color: "white",
                        fontWeight: 700,
                        "&:hover": { bgcolor: "#333" },
                      }}
                    >
                      Add to Cart
                    </Button>
                  ) : (
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      spacing={1}
                    >
                      <IconButton
                        sx={{ bgcolor: "#f5f5f5" }}
                        onClick={() => handleCartAction(product, "decrement")}
                      >
                        <Remove />
                      </IconButton>
                      <Typography fontWeight={700}>
                        {getItemQty(product._id || product.id)}
                      </Typography>
                      <IconButton
                        sx={{ bgcolor: "#f5f5f5" }}
                        onClick={() => handleCartAction(product, "increment")}
                      >
                        <Add />
                      </IconButton>
                    </Stack>
                  )}
                </Box>
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
