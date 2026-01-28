import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Divider,
  IconButton,
  Sheet,
  Avatar,
  Card,
  Skeleton,
} from "@mui/joy";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowLeft,
  CreditCard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../../services/cartService";
import { useCustomerAuthStore } from "../../store/useCustomerAuthStore";
import { getSubdomain } from "../../../storeResolver";
import Header from "../admin(demo)/components/header";
import { toast } from "react-toastify";
import Footer from "../admin(demo)/components/footer";

const CartDashboard = ({ storeSlug: propStoreSlug }) => {
  const resolvedSlug = propStoreSlug || getSubdomain();
  const {
    cart,
    loading,
    fetchCart,
    updateQuantity,
    removeItem,
    getTotalPrice,
  } = useCartStore();
  const { customer } = useCustomerAuthStore();

  const [storeData, setStoreData] = useState(null);
  const [isStoreLoading, setIsStoreLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!customer) {
      toast.error("Please login to view your bag!", {
        containerId: "STOREFRONT",
      });
      const timer = setTimeout(() => navigate("/login"), 2000);
      return () => clearTimeout(timer);
    }
  }, [customer, navigate]);

  const hasAddress = useMemo(() => {
    return (
      customer?.address?.street &&
      customer?.address?.city &&
      customer?.address?.phone
    );
  }, [customer]);
  
  useEffect(() => {
    const validateStore = async () => {
      try {
        setIsStoreLoading(true);
        const API_URL =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
        const res = await fetch(`${API_URL}/api/stores/public/${resolvedSlug}`);
        const result = await res.json();
        if (!res.ok || !result.success) {
          setError(true);
        } else {
          setStoreData(result.data);
        }
      } catch (err) {
        setError(true);
      } finally {
        setIsStoreLoading(false);
      }
    };
    if (resolvedSlug) validateStore();
  }, [resolvedSlug]);

  useEffect(() => {
    if (storeData?._id && customer) {
      fetchCart(storeData._id);
    }
  }, [storeData?._id, customer, fetchCart]);

  const handleCustomerCheckout = async () => {
    const currentTotal = cart?.cartTotal || 0;

    if (!storeData || !storeData._id) {
      console.error("Checkout failed: storeData is null", { storeData });
      toast.error(
        "Store information is still loading. Please try again in a second.",
      );
      return;
    }
    if (!customer || !storeData?.paystack?.subaccountCode) {
      toast.error("Checkout unavailable. Vendor setup incomplete.");
      return;
    }

    if (!storeData) {
      toast.error("Store information is still loading. Please wait.");
      return;
    }

    if (!customer || !storeData?.paystack?.subaccountCode) {
      toast.error("Checkout unavailable. Vendor setup incomplete.");
      return;
    }

    if (!storeData?.paystack?.subaccountCode) {
      toast.error("Checkout unavailable. Vendor has no subaccount.");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/paystack/customer-init`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // This uses the Customer's token, not the Store owner's
            Authorization: `Bearer ${useCustomerAuthStore.getState().token}`,
            "x-store-slug": resolvedSlug,
          },
          body: JSON.stringify({
            email: customer.email,
            amount: currentTotal,
            storeId: storeData?._id,
            subaccount: storeData?.paystack?.subaccountCode,
            storeName: storeData?.name,
            storeLogo: storeData?.logo?.url,
            origin: window.location.origin,
          }),
        },
      );

      const data = await res.json();
      console.log(data);
      if (!res.ok) throw new Error(data.message);

      // Redirect customer to Paystack
      window.location.href = data.url;
    } catch (err) {
      toast.error(err.message, {
        containerId: "STOREFRONT",
      });
    }
  };
  // --- SKELETON COMPONENT ---
  const CartSkeleton = () => (
    <Box sx={{ maxWidth: "1200px", mx: "auto", p: { xs: 2, md: 4 } }}>
      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <Skeleton variant="circular" width={32} height={32} />
        <Skeleton variant="text" width={250} height={40} />
      </Stack>
      <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
        <Box sx={{ flex: 1 }}>
          <Stack spacing={2}>
            {[1, 2, 3].map((i) => (
              <Card key={i} orientation="horizontal" sx={{ gap: 2 }}>
                {/* FIX: Move borderRadius into sx */}
                <Skeleton
                  variant="rectangular"
                  width={100}
                  height={100}
                  sx={{ borderRadius: "md" }}
                />
                <Box sx={{ flex: 1 }}>
                  <Skeleton
                    variant="text"
                    width="60%"
                    height={24}
                    sx={{ mb: 1 }}
                  />
                  <Skeleton variant="text" width="30%" sx={{ mb: 2 }} />
                  <Skeleton variant="rectangular" width={100} height={32} />
                </Box>
              </Card>
            ))}
          </Stack>
        </Box>
        <Box sx={{ width: { xs: "100%", md: "350px" } }}>
          <Sheet variant="outlined" sx={{ p: 3, borderRadius: "xl" }}>
            <Skeleton variant="text" width="50%" height={30} sx={{ mb: 2 }} />
            <Stack spacing={2}>
              <Skeleton variant="text" height={20} />
              <Skeleton variant="text" height={20} />
              <Divider sx={{ my: 1 }} />
              {/* FIX: Move borderRadius into sx */}
              <Skeleton
                variant="rectangular"
                height={50}
                sx={{ borderRadius: "md" }}
              />
            </Stack>
          </Sheet>
        </Box>
      </Stack>
    </Box>
  );

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography color="danger">Store not found.</Typography>
      </Box>
    );
  }

  const isEmpty = !cart || !cart.items || cart.items.length === 0;

  return (
    <div>
      <Header storeName={storeData?.name} storeLogo={storeData?.logo?.url} />

      {/* Show Skeleton while loading store or initially loading cart */}
      {isStoreLoading || (loading && !cart) ? (
        <CartSkeleton />
      ) : (
        <Box sx={{ maxWidth: "1200px", mx: "auto", p: { xs: 2, md: 4 } }}>
          {/* Header */}
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
            <IconButton
              variant="outlined"
              size="sm"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft size={18} />
            </IconButton>
            <Typography level="h3" fontWeight="xl">
              Your Shopping Bag
            </Typography>
          </Stack>

          {isEmpty ? (
            <Sheet
              variant="outlined"
              sx={{
                p: 8,
                borderRadius: "xl",
                textAlign: "center",
                bgcolor: "background.surface",
              }}
            >
              <ShoppingBag
                size={48}
                style={{ opacity: 0.2, marginBottom: "16px" }}
              />
              <Typography level="h4">Your bag is empty</Typography>
              <Typography level="body-sm" sx={{ mb: 3 }}>
                Looks like you haven't added anything to your cart yet.
              </Typography>
              <Button
                variant="solid"
                color="primary"
                onClick={() => navigate("/shop")}
              >
                Start Shopping
              </Button>
            </Sheet>
          ) : (
            <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
              {/* 1. ITEMS LIST */}
              {/* Main Cart Container */}
              <Box sx={{ flex: 1 }}>
                {isEmpty ? (
                  /* --- CASE 1: EMPTY CART STATE --- */
                  <Sheet
                    variant="outlined"
                    sx={{
                      p: 8,
                      borderRadius: "xl",
                      textAlign: "center",
                      bgcolor: "background.surface",
                      borderStyle: "dashed", // Makes it look like a placeholder
                      borderColor: "neutral.300",
                    }}
                  >
                    <ShoppingBag
                      size={48}
                      style={{
                        opacity: 0.2,
                        marginBottom: "16px",
                        margin: "0 auto",
                      }}
                    />
                    <Typography level="h4">Your bag is empty</Typography>
                    <Typography level="body-sm" sx={{ mb: 3 }}>
                      Looks like you haven't added anything to your cart yet.
                    </Typography>
                    <Button
                      variant="solid"
                      color="primary"
                      onClick={() => navigate("/products")}
                    >
                      Start Shopping
                    </Button>
                  </Sheet>
                ) : (
                  /* --- CASE 2: ITEMS IN CART --- */
                  <Stack spacing={2}>
                    {cart.items.map((item) => (
                      <Card
                        key={item.product._id}
                        orientation="horizontal"
                        variant="outlined"
                        sx={{
                          gap: 2,
                          bgcolor: "neutral.50",
                          borderColor: "neutral.200",
                          transition: "0.2s",
                          "&:hover": {
                            borderColor: "primary.300",
                            boxShadow: "sm",
                          },
                        }}
                      >
                        <Avatar
                          src={
                            item.product.images?.[0]?.url || item.product.image
                          }
                          variant="rounded"
                          sx={{ width: 100, height: 100 }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography level="title-md" fontWeight="bold">
                              {item.product.name}
                            </Typography>
                            <IconButton
                              size="sm"
                              color="danger"
                              variant="plain"
                              disabled={loading} // Prevent multiple clicks during API call
                              onClick={() =>
                                removeItem(storeData._id, item.product._id)
                              }
                            >
                              <Trash2 size={16} />
                            </IconButton>
                          </Stack>

                          <Typography level="body-sm" sx={{ mb: 1 }}>
                            ₦{item.product.price?.toLocaleString()}
                          </Typography>

                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1.5}
                          >
                            <IconButton
                              size="sm"
                              variant="outlined"
                              onClick={async () =>
                                await updateQuantity(
                                  storeData._id,
                                  item.product._id,
                                  item.quantity - 1,
                                )
                              }
                              disabled={item.quantity <= 1 || loading}
                            >
                              <Minus size={14} />
                            </IconButton>

                            <Typography
                              fontWeight="bold"
                              sx={{ minWidth: "20px", textAlign: "center" }}
                            >
                              {item.quantity}
                            </Typography>

                            <IconButton
                              size="sm"
                              variant="outlined"
                              onClick={async () =>
                                await updateQuantity(
                                  storeData._id,
                                  item.product._id,
                                  item.quantity + 1,
                                )
                              }
                              disabled={loading}
                            >
                              <Plus size={14} />
                            </IconButton>
                          </Stack>
                        </Box>
                      </Card>
                    ))}
                  </Stack>
                )}
              </Box>

              {/* 2. SUMMARY & CHECKOUT */}
              <Box sx={{ width: { xs: "100%", md: "350px" } }}>
                <Sheet
                  variant="outlined"
                  sx={{
                    p: 3,
                    borderRadius: "xl",
                    position: "sticky",
                    top: 20,
                    boxShadow: "sm",
                  }}
                >
                  <Typography level="title-lg" sx={{ mb: 2 }}>
                    Order Summary
                  </Typography>
                  {/* Replace all instances of getTotalPrice() with cart.cartTotal */}
                  <Stack direction="row" justifyContent="space-between">
                    <Typography level="body-md" color="neutral">
                      Subtotal
                    </Typography>
                    <Typography level="title-md">
                      {/* Use cartTotal directly from state */}₦
                      {cart?.cartTotal?.toLocaleString() || 0}
                    </Typography>
                  </Stack>

                  {/* ... similar change for the Total row ... */}
                  <Stack direction="row" justifyContent="space-between">
                    <Typography level="h4">Total</Typography>
                    <Typography level="h4">
                      ₦{cart?.cartTotal?.toLocaleString() || 0}
                    </Typography>
                  </Stack>
                  {/* ADDRESS DISCLAIMER */}
                  {!hasAddress && (
                    <Box
                      sx={{
                        mt: 3,
                        p: 2,
                        bgcolor: "warning.softBg",
                        borderRadius: "md",
                        border: "1px solid",
                        borderColor: "warning.outlinedBorder",
                      }}
                    >
                      <Typography
                        level="body-xs"
                        color="warning"
                        fontWeight="bold"
                      >
                        Shipping Address Required
                      </Typography>
                      <Typography level="body-xs" sx={{ mb: 1, mt: 0.5 }}>
                        Please add your shipping address in settings to proceed
                        with this order.
                      </Typography>
                      <Button
                        size="sm"
                        variant="plain"
                        color="warning"
                        onClick={() => navigate("/account")} // or wherever your address form is
                        sx={{ p: 0, textDecoration: "underline" }}
                      >
                        Go to Settings
                      </Button>
                    </Box>
                  )}
                  <Button
                    fullWidth
                    size="lg"
                    variant="solid"
                    disabled={!storeData?.paystack?.verified || !hasAddress} // 🔒 Don't let customers pay unverified vendors
                    startDecorator={<CreditCard />}
                    sx={{ mt: 4, bgcolor: "neutral.900" }}
                    onClick={handleCustomerCheckout}
                  >
                    {storeData?.paystack?.verified
                      ? "Proceed to Checkout"
                      : "Checkout Unavailable"}
                  </Button>
                </Sheet>
              </Box>
            </Stack>
          )}
        </Box>
      )}
      <div className="mt-10!">
        <div className="relative bottom-0 right-0  left-0">
          <Footer storeDescription={storeData?.description} storeLogo={storeData?.logo?.url} storeName={storeData?.name}/>
        </div>
      </div>
    </div>
  );
};

export default CartDashboard;
