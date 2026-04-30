import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Stack,
  AspectRatio,
  IconButton,
  Divider,
  Grid,
  Sheet,
  Breadcrumbs,
  Link,
  Skeleton,
  Tab,
  TabList,
  Tabs,
  tabClasses,
} from "@mui/joy";
import {
  ChevronRight,
  ShoppingCart,
  Minus,
  Plus,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Store,
} from "lucide-react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useCartStore } from "../../../services/cartService";
import { getSubdomain } from "../../../storeResolver";
import { toast } from "react-toastify";
import Header from "../admin(demo)/components/header";
import Footer from "../admin(demo)/components/footer";
import { useCustomerAuthStore } from "../../store/useCustomerAuthStore";

const responsive = {
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 5 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 3 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 2 },
};

const ProductPage = ({ storeSlug, isStarter, storeData }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const sub = getSubdomain();
  const pathParts = window.location.pathname.split("/").filter(Boolean);
  const resolvedSlug = sub || pathParts[0];
  const { addToCart, loading: cartLoading } = useCartStore();
  const { customer } = useCustomerAuthStore();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  // Returns the best matching variant and whether the combo is valid
  const getVariantStatus = () => {
    if (!product?.variants?.length) {
      return {
        variant: null,
        price: product?.price || 0,
        available: true,
        impossible: false,
      };
    }

    // Nothing selected — just show base price
    if (!selectedColor && !selectedSize) {
      return {
        variant: null,
        price: product.price,
        available: true,
        impossible: false,
      };
    }

    // Try to find exact match
    const exactMatch = product.variants.find((v) => {
      const colorMatch = !selectedColor || v.color === selectedColor;
      const sizeMatch = !selectedSize || v.size === selectedSize;
      return colorMatch && sizeMatch;
    });

    if (exactMatch) {
      return {
        variant: exactMatch,
        price:
          exactMatch.price && Number(exactMatch.price) > 0
            ? exactMatch.price
            : product.price,
        available: true,
        impossible: false,
      };
    }

    // No exact match — this combo doesn't exist
    return {
      variant: null,
      price: null, // null = impossible, don't show a price
      available: false,
      impossible: true,
    };
  };

  const computedPrice = () => {
    const { price } = getVariantStatus();
    return price ?? product?.price ?? 0;
  };
  const colorNameToHex = (name = "") => {
    const map = {
      black: "#000000",
      white: "#FFFFFF",
      red: "#E24B4A",
      navy: "#042C53",
      green: "#3B6D11",
      blue: "#185FA5",
      yellow: "#EF9F27",
      pink: "#D4537E",
      purple: "#534AB7",
      gray: "#888780",
      grey: "#888780",
      silver: "#C0C0C0",
      gold: "#D4AF37",
      orange: "#E07033",
      brown: "#7B4F2E",
      beige: "#D9C9A8",
    };
    return map[name.toLowerCase()] || "#e2e8f0";
  };
  // console.log(product);
  // 1. Optimized useEffect to prevent unnecessary flicker
  useEffect(() => {
    let isMounted = true;
    setSelectedColor(""); // ✅ reset on product change
    setSelectedSize("");
    const fetchData = async () => {
      if (!id || !resolvedSlug) return;

      try {
        setLoading(true);
        const API_URL =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

        const [pRes, rRes] = await Promise.all([
          fetch(`${API_URL}/api/products/${id}`),
          fetch(`${API_URL}/api/products/public/${resolvedSlug}`),
        ]);

        const pData = await pRes.json();
        const rData = await rRes.json();
        if (isMounted) {
          if (pData.product) setProduct(pData.product);
          if (rData.products) {
            setRelatedProducts(rData.products.filter((p) => p._id !== id));
          }
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    }; // Cleanup to prevent memory leaks
  }, [id, resolvedSlug]);
  // Use resolvedSlug instead of window.location.hostname

  const getStorePath = (path) => {
    return isStarter ? `/${storeSlug}${path}` : path;
  };
  const handleAddToCart = async () => {
    if (!customer) {
      toast.info("Please login to add items to cart");
      navigate(getStorePath("/login"));
      return;
    }

    if (!storeData?._id || !product?._id) {
      toast.error("Loading product data, please wait...", {
        containerId: "STOREFRONT",
      });
      return;
    }

    // Block impossible combinations
    const { impossible, price } = getVariantStatus();
    if (impossible) {
      toast.warning(
        `${selectedColor} is not available in size ${selectedSize}. Please choose a different combination.`,
        { containerId: "STOREFRONT" },
      );
      return;
    }

    try {
      await addToCart(storeData._id, product._id, quantity, {
        color: selectedColor || undefined,
        size: selectedSize || undefined,
        price: price ?? product.price,
      });
      toast.success("Added to bag!", {
        position: "bottom-right",
        autoClose: 2000,
        containerId: "STOREFRONT",
      });
    } catch (err) {
      console.error("Cart Error:", err);
      toast.error(err.response?.data?.message || "Could not add to cart", {
        containerId: "STOREFRONT",
      });
    }
  };

  if (loading) return <ProductSkeleton />;

  return (
    <Box sx={{ bgcolor: "#F1F1F2", minHeight: "100vh" }}>
      <Header
        storeName={storeData?.name}
        storeData={storeData}
        storeLogo={storeData?.logo?.url}
        storeSlug={storeSlug} // Pass the slug
        isStarter={storeData?.plan === "starter"} // Pass the plan check
      />

      {/* 1. Breadcrumbs */}
      <Box sx={{ maxWidth: "1200px", mx: "auto", px: 2, py: 1.5 }}>
        <Breadcrumbs
          separator={<ChevronRight size={14} />}
          sx={{ p: 0, bgcolor: "transparent" }}
        >
          <Link
            underline="hover"
            color="neutral"
            sx={{ fontSize: "13px" }}
            onClick={() => navigate("/")}
          >
            Home
          </Link>
          <Typography sx={{ fontSize: "13px", color: "#75757A" }}>
            {product?.name}
          </Typography>
        </Breadcrumbs>
      </Box>

      <Grid
        container
        spacing={2}
        sx={{ maxWidth: "1200px", mx: "auto", px: { xs: 1, md: 2 } }}
      >
        {/* LEFT: Main Product Card */}
        <Grid xs={12} md={9}>
          <Sheet
            sx={{ p: { xs: 2, md: 3 }, borderRadius: "sm", boxShadow: "sm" }}
          >
            <Grid container spacing={4}>
              {/* Product Image */}
              <Grid xs={12} sm={5}>
                <AspectRatio
                  ratio="1/1"
                  sx={{ borderRadius: "sm", border: "1px solid #F1F1F2" }}
                >
                  <img
                    src={product?.images?.[0]?.url || product?.image}
                    alt={product?.name}
                  />
                </AspectRatio>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ mt: 2, overflowX: "auto" }}
                >
                  {/* Thumbnail mapping here if you have multiple images */}
                </Stack>
              </Grid>

              {/* Purchase Details */}
              {/* Purchase Details */}
              <Grid xs={12} sm={7}>
                <Stack spacing={1}>
                  <Typography
                    level="h4"
                    sx={{ fontSize: "20px", fontWeight: 500, color: "#313133" }}
                  >
                    {product?.name}
                  </Typography>
                  <Typography level="body-xs">
                    Brand:{" "}
                    <Link color="primary">Official {storeData?.name}</Link>
                  </Typography>

                  <Divider sx={{ my: 1 }} />

                  {/* PRICE — updates live as options are selected */}
                  <Typography
                    level="h2"
                    sx={{ color: "#313133", fontWeight: 700 }}
                  >
                    ₦ {computedPrice().toLocaleString()}
                    {computedPrice() !== product?.price && (
                      <Typography
                        component="span"
                        level="body-sm"
                        sx={{
                          ml: 1,
                          color: "#75757A",
                          textDecoration: "line-through",
                          fontWeight: 400,
                        }}
                      >
                        ₦{product?.price?.toLocaleString()}
                      </Typography>
                    )}
                  </Typography>

                  {/* 
                  <Typography level="body-sm"
  sx={{ mb: 1, fontWeight: 600, textTransform: "uppercase", fontSize: "12px", color: "#313133" }}>
  {group.name}
  <Typography component="span" sx={{ ml: 1, fontSize: "10px", fontWeight: 400, color: "#94a3b8", textTransform: "none" }}>
    optional
  </Typography>
  {selectedVariations[group.name] && (
    <Typography component="span"
      sx={{ ml: 1, fontWeight: 400, textTransform: "none", color: "#75757A", fontSize: "12px" }}>
      — {selectedVariations[group.name].value}
    </Typography>
  )}
</Typography> */}

                  {/* ✅ VARIATIONS — moved here so selection + price change happen in same view */}
                  {product?.variants?.length > 0 &&
                    (() => {
                      const colors = [
                        ...new Set(
                          product.variants.map((v) => v.color).filter(Boolean),
                        ),
                      ];
                      const sizes = [
                        ...new Set(
                          product.variants.map((v) => v.size).filter(Boolean),
                        ),
                      ];
                      const selectedVariant = product.variants.find(
                        (v) =>
                          (!v.color || v.color === selectedColor) &&
                          (!v.size || v.size === selectedSize),
                      );

                      return (
                        <Box sx={{ mt: 1 }}>
                          {colors.length > 0 && (
                            <Box sx={{ mb: 2 }}>
                              <Typography
                                level="body-sm"
                                sx={{
                                  mb: 1,
                                  fontWeight: 600,
                                  fontSize: "12px",
                                  textTransform: "uppercase",
                                }}
                              >
                                Color{" "}
                                {selectedColor && (
                                  <span
                                    style={{
                                      fontWeight: 400,
                                      color: "#75757A",
                                    }}
                                  >
                                    — {selectedColor}
                                  </span>
                                )}
                              </Typography>
                              <Stack
                                direction="row"
                                spacing={1}
                                flexWrap="wrap"
                                useFlexGap
                              >
                                {colors.map((color) => {
                                  const variant = product.variants.find(
                                    (v) => v.color === color,
                                  );
                                  const hex =
                                    variant?.hex || colorNameToHex(color);
                                  const isSelected = selectedColor === color;

                                  // Is this color available with the currently selected size?
                                  const isAvailableWithSize =
                                    !selectedSize ||
                                    product.variants.some(
                                      (v) =>
                                        v.color === color &&
                                        v.size === selectedSize,
                                    );

                                  return (
                                    <Box
                                      key={color}
                                      onClick={() => {
                                        if (isSelected) {
                                          setSelectedColor("");
                                        } else {
                                          setSelectedColor(color);
                                          // If current size is incompatible with this color, clear the size
                                          const compatible =
                                            product.variants.some(
                                              (v) =>
                                                v.color === color &&
                                                v.size === selectedSize,
                                            );
                                          if (selectedSize && !compatible)
                                            setSelectedSize("");
                                        }
                                      }}
                                      title={
                                        isAvailableWithSize
                                          ? color
                                          : `${color} not available in ${selectedSize}`
                                      }
                                      sx={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: "50%",
                                        bgcolor: hex,
                                        border: isSelected
                                          ? "3px solid #313133"
                                          : "2px solid #e2e8f0",
                                        cursor: isAvailableWithSize
                                          ? "pointer"
                                          : "not-allowed",
                                        transition: "0.15s",
                                        opacity: isAvailableWithSize ? 1 : 0.35,
                                        // Strike-through line for unavailable colors
                                        position: "relative",
                                        "&::after": !isAvailableWithSize
                                          ? {
                                              content: '""',
                                              position: "absolute",
                                              top: "50%",
                                              left: -2,
                                              right: -2,
                                              height: "2px",
                                              bgcolor: "#94a3b8",
                                              transform: "rotate(-45deg)",
                                            }
                                          : {},
                                        "&:hover": isAvailableWithSize
                                          ? { transform: "scale(1.15)" }
                                          : {},
                                      }}
                                    />
                                  );
                                })}
                              </Stack>
                            </Box>
                          )}

                          {sizes.length > 0 && (
                            <Box sx={{ mb: 2 }}>
                              <Typography
                                level="body-sm"
                                sx={{
                                  mb: 1,
                                  fontWeight: 600,
                                  fontSize: "12px",
                                  textTransform: "uppercase",
                                }}
                              >
                                Size{" "}
                                {selectedSize && (
                                  <span
                                    style={{
                                      fontWeight: 400,
                                      color: "#75757A",
                                    }}
                                  >
                                    — {selectedSize}
                                  </span>
                                )}
                              </Typography>
                              <Stack
                                direction="row"
                                spacing={1}
                                flexWrap="wrap"
                                useFlexGap
                              >
                                {sizes.map((size) => {
                                  const isSelected = selectedSize === size;

                                  // Is this size available with the currently selected color?
                                  const isAvailableWithColor =
                                    !selectedColor ||
                                    product.variants.some(
                                      (v) =>
                                        v.size === size &&
                                        v.color === selectedColor,
                                    );

                                  const sizeVariant = product.variants.find(
                                    (v) =>
                                      v.size === size &&
                                      (!v.color ||
                                        !selectedColor ||
                                        v.color === selectedColor),
                                  );

                                  return (
                                    <Box
                                      key={size}
                                      onClick={() => {
                                        if (!isAvailableWithColor) return; // block click on impossible combos
                                        setSelectedSize(isSelected ? "" : size);
                                      }}
                                      sx={{
                                        px: 1.5,
                                        py: 0.5,
                                        borderRadius: "4px",
                                        fontSize: "13px",
                                        border: isSelected
                                          ? "2px solid #313133"
                                          : "1px solid #e2e8f0",
                                        fontWeight: isSelected ? 600 : 400,
                                        cursor: isAvailableWithColor
                                          ? "pointer"
                                          : "not-allowed",
                                        bgcolor: isSelected
                                          ? "#313133"
                                          : "white",
                                        color: isSelected
                                          ? "white"
                                          : isAvailableWithColor
                                            ? "#313133"
                                            : "#94a3b8",
                                        opacity: isAvailableWithColor ? 1 : 0.4,
                                        textDecoration: isAvailableWithColor
                                          ? "none"
                                          : "line-through",
                                        transition: "0.15s",
                                        "&:hover": isAvailableWithColor
                                          ? { borderColor: "#313133" }
                                          : {},
                                      }}
                                    >
                                      {size}
                                      {sizeVariant?.price &&
                                        Number(sizeVariant.price) > 0 &&
                                        isAvailableWithColor && (
                                          <Typography
                                            component="span"
                                            sx={{
                                              fontSize: "11px",
                                              ml: 0.5,
                                              opacity: 0.75,
                                            }}
                                          >
                                            ₦
                                            {Number(
                                              sizeVariant.price,
                                            ).toLocaleString()}
                                          </Typography>
                                        )}
                                    </Box>
                                  );
                                })}
                              </Stack>
                            </Box>
                          )}
                        </Box>
                      );
                    })()}

                  {/* QUANTITY */}
                  <Box sx={{ mt: 1 }}>
                    <Typography level="body-sm" sx={{ mb: 1, fontWeight: 600 }}>
                      QUANTITY
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Sheet
                        variant="outlined"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          borderRadius: "4px",
                          p: 0.5,
                        }}
                      >
                        <IconButton
                          size="sm"
                          variant="plain"
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        >
                          <Minus size={16} />
                        </IconButton>
                        <Typography sx={{ px: 3, fontWeight: "bold" }}>
                          {quantity}
                        </Typography>
                        <IconButton
                          size="sm"
                          variant="plain"
                          onClick={() => setQuantity((q) => q + 1)}
                        >
                          <Plus size={16} />
                        </IconButton>
                      </Sheet>
                    </Stack>
                  </Box>

                  {/* BUTTON with live price */}
                  <Button
                    size="lg"
                    loading={cartLoading}
                    startDecorator={<ShoppingCart />}
                    onClick={handleAddToCart}
                    className="bg-slate-800/90!"
                    sx={{
                      mt: 2,
                      height: "50px",
                      fontSize: "16px",
                      "&:hover": { bgcolor: "#E07B16" },
                    }}
                  >
                    ADD TO CART — ₦{computedPrice().toLocaleString()}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </Sheet>

          {/* Description Section */}
          <Sheet sx={{ mt: 2, p: 3, borderRadius: "sm", boxShadow: "sm" }}>
            <Typography
              level="title-lg"
              sx={{
                mb: 2,
                textTransform: "uppercase",
                fontSize: "14px",
                fontWeight: 700,
              }}
            >
              Product Details
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Typography
              sx={{ color: "#313133", lineHeight: 1.7, whiteSpace: "pre-line" }}
            >
              {product?.description ||
                "No specific details available for this product."}
            </Typography>
          </Sheet>
        </Grid>

        {/* RIGHT: Delivery Sidebar */}
        <Grid xs={12} md={3}>
          <Stack spacing={2}>
            <Sheet sx={{ p: 2, borderRadius: "sm", boxShadow: "sm" }}>
              <Typography
                level="title-sm"
                sx={{ mb: 2, borderBottom: "1px solid #F1F1F2", pb: 1 }}
              >
                DELIVERY & RETURNS
              </Typography>
              <Stack spacing={2.5}>
                <DeliveryItem
                  icon={<Truck size={22} />}
                  title="Door Delivery"
                  desc={`${product?.delivery || "Delivery details on request"}`}
                />
                <DeliveryItem
                  icon={<RotateCcw size={22} />}
                  title="Return Policy"
                  desc={`${product?.returnPolicy || "Standard 7-day return policy applies"}`}
                />
                <DeliveryItem
                  icon={<ShieldCheck size={22} />}
                  title="Warranty"
                  desc={`${product?.warranty || "Manufacturer's warranty applies"}`}
                />
              </Stack>
            </Sheet>

            <Sheet sx={{ p: 2, borderRadius: "sm", boxShadow: "sm" }}>
              <Typography level="title-sm" sx={{ mb: 1.5 }}>
                SELLER INFORMATION
              </Typography>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box sx={{ bgcolor: "#F1F1F2", p: 1, borderRadius: "sm" }}>
                  <Store size={20} />
                </Box>
                <Typography level="title-md">{storeData?.name}</Typography>
              </Stack>
              <Button
                className="text-slate-900/80! hover:bg-transparent! underline!"
                variant="plain"
                size="sm"
                onClick={() =>
                  navigate(isStarter ? `/${storeData.subdomain}/shop` : "/shop")
                }
                fullWidth
                sx={{ mt: 2, color: "#F68B1E" }}
              >
                Visit Store
              </Button>
            </Sheet>
          </Stack>
        </Grid>
      </Grid>

      {/* Recommended Carousel */}
      <Box sx={{ maxWidth: "1200px", mx: "auto", px: 2, mt: 4 }}>
        <Sheet sx={{ p: 2, borderRadius: "sm", boxShadow: "sm" }}>
          {/* Header with Title and Link */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography level="title-md" sx={{ fontWeight: 600 }}>
              Customers also viewed
            </Typography>
            <Link
              className="text-slate-900/80! underline!"
              onClick={() => navigate(getStorePath(`/shop`))}
              sx={{
                fontSize: "14px",
                fontWeight: 700,
                color: "#F68B1E",
                "&:hover": { textDecoration: "underline neutral.900" },
              }}
            >
              SEE ALL <ChevronRight size={16} />
            </Link>
          </Stack>

          <Carousel
            responsive={responsive}
            infinite
            swipeable
            draggable
            arrows={true}
          >
            {relatedProducts.map((item) => (
              <Box
                key={item._id}
                onClick={() =>
                  navigate(getStorePath(`/shop/product/${item._id}`))
                }
                sx={{
                  p: 1,
                  cursor: "pointer",
                  "&:hover img": { transform: "scale(1.05)" },
                  "&:hover .prod-name": { color: "#F68B1E" }, // Name turns orange on hover
                }}
              >
                <AspectRatio
                  ratio="1/1"
                  sx={{
                    borderRadius: "xs",
                    mb: 1,
                    overflow: "hidden",
                    border: "1px solid #F1F1F2",
                  }}
                >
                  <img
                    src={item.images?.[0]?.url || item.image}
                    alt=""
                    style={{ transition: "0.3s" }}
                  />
                </AspectRatio>

                <Typography
                  className="prod-name"
                  sx={{
                    fontSize: "13px",
                    height: "36px",
                    overflow: "hidden",
                    transition: "0.2s",
                  }}
                >
                  {item.name}
                </Typography>

                <Typography sx={{ fontWeight: 700, mt: 0.5 }}>
                  ₦{item.price?.toLocaleString()}
                </Typography>
              </Box>
            ))}
          </Carousel>
        </Sheet>
      </Box>
      <div className="mt-10!">
        <div className="relative bottom-0 right-0  left-0">
          <Footer
            storeName={storeData?.name}
            storeEmail={storeData?.email}
            storeDescription={storeData?.description}
            storeInstagram={storeData?.socialLinks?.instagram}
            storeFacebook={storeData?.socialLinks?.facebook}
            storeAddress={storeData?.address}
            storeTwitter={storeData?.socialLinks?.twitter}
            storeLogo={storeData?.logo?.url}
            storeId={storeData?._id}
            isStarter={storeData?.plan === "starter"}
            storeSlug={storeSlug}
          />
        </div>
      </div>
    </Box>
  );
};

const ProductSliderItem = ({ item, navigate }) => (
  <Box
    onClick={() => navigate(`/product/${item._id}`)}
    sx={{
      p: 1,
      cursor: "pointer",
      transition: "0.2s",
      "&:hover": {
        "& img": { transform: "scale(1.05)" },
        "& .product-name": { color: "#F68B1E" },
      },
    }}
  >
    <AspectRatio
      ratio="1/1"
      sx={{
        borderRadius: "xs",
        mb: 1,
        overflow: "hidden",
        border: "1px solid #F1F1F2",
      }}
    >
      <img
        src={item.images?.[0]?.url || item.image}
        alt={item.name}
        style={{ transition: "0.3s" }}
      />
    </AspectRatio>
    <Typography
      className="product-name"
      sx={{
        fontSize: "13px",
        height: "36px",
        overflow: "hidden",
        color: "#313133",
      }}
    >
      {item.name}
    </Typography>
    <Typography sx={{ fontWeight: 700, mt: 0.5 }}>
      ₦{item.price?.toLocaleString()}
    </Typography>
    {item.price && (
      <Typography
        level="body-xs"
        sx={{ textDecoration: "line-through neutral.900", color: "#75757A" }}
      >
        ₦{(item.price * 1.2).toLocaleString()}
      </Typography>
    )}
  </Box>
);

// Helper Component for Sidebar
const DeliveryItem = ({ icon, title, desc }) => (
  <Stack direction="row" spacing={1.5}>
    <Box sx={{ color: "#313133" }}>{icon}</Box>
    <Box>
      <Typography sx={{ fontSize: "13px", fontWeight: 600 }}>
        {title}
      </Typography>
      <Typography sx={{ fontSize: "11px", color: "#75757A" }}>
        {desc}
      </Typography>
    </Box>
  </Stack>
);

// Loading State
const ProductSkeleton = () => (
  <Box sx={{ maxWidth: "1200px", mx: "auto", p: 4 }}>
    <Grid container spacing={2}>
      <Grid xs={12} md={9}>
        <Skeleton variant="rectangular" height={500} />
      </Grid>
      <Grid xs={12} md={3}>
        <Skeleton variant="rectangular" height={500} />
      </Grid>
    </Grid>
  </Box>
);

export default ProductPage;
