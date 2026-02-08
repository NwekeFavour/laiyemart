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
  const {customer} = useCustomerAuthStore();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [allProducts, setAllProducts] = useState([]);
  // 1. Optimized useEffect to prevent unnecessary flicker
  useEffect(() => {
  let isMounted = true;

  const fetchData = async () => {
    if (!id || !resolvedSlug) return;
    
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

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
  return () => { isMounted = false; }; // Cleanup to prevent memory leaks
}, [id, resolvedSlug]);
// Use resolvedSlug instead of window.location.hostname

  const getStorePath = (path) => {
    return isStarter ? `/${storeSlug}${path}` : path;
  };
const handleAddToCart = async () => {
  // console.log("Store ID:", storeData?._id, "Product ID:", product?._id);
  
  if (!customer) {
    toast.info("Please login to add items to cart");
    navigate(getStorePath("/login"));
    return;
  }

  if (!storeData?._id || !product?._id) {
    toast.error("Loading product data, please wait...", {containerId: "STOREFRONT"});
    return;
  }
       
  try {
    // Note: Ensuring we pass strings to the store
    await addToCart(storeData._id, product._id, quantity);
    
    toast.success("Added to bag!", {
      position: "bottom-right",
      autoClose: 2000,
      containerId: "STOREFRONT",
    });
  } catch (err) {
    console.error("Cart Error:", err);
    toast.error(err.response?.data?.message || "Could not add to cart", {containerId: "STOREFRONT"});
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
                    src={product.images?.[0]?.url || product.image}
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

                  <Typography
                    level="h2"
                    sx={{ color: "#313133", fontWeight: 700 }}
                  >
                    ₦ {product?.price?.toLocaleString()}
                  </Typography>                  

                  <Box sx={{ mt: 3 }}>
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

                  <Button
                    size="lg"
                    loading={cartLoading}
                    startDecorator={<ShoppingCart />}
                    onClick={handleAddToCart}
                    className="bg-slate-800/90!"
                    sx={{
                      mt: 4,
                      height: "50px",
                      fontSize: "16px",
                      "&:hover": { bgcolor: "#E07B16" },
                    }}
                  >
                    ADD TO CART
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
                onClick={() => navigate(isStarter ? `/${storeData.subdomain}/shop` : "/shop")}
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
                "&:hover": {  textDecoration: "underline neutral.900"  },
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
                onClick={() => navigate(getStorePath(`/shop/product/${item._id}`))}
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
            storeDescription={storeData?.description}
            storeLogo={storeData?.logo?.url}
            storeName={storeData?.name}
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
        sx={{ textDecoration: "line-through neutral.900",color: "#75757A" }}
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
