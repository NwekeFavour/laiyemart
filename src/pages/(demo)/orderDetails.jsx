import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  Divider,
  Stack,
  Typography,
  Chip,
  AspectRatio,
  Skeleton,
} from "@mui/joy";
import { CheckCircle2, Package, Truck, Calendar } from "lucide-react";
import { toast } from "react-toastify";
import { useCustomerAuthStore } from "../../store/useCustomerAuthStore";
import Header from "../admin(demo)/components/header";
import Footer from "../admin(demo)/components/footer";

export default function OrderDetails({
  storeSlug,
  storeData,
  storeLogo,
  storeName,
  isStarter,
}) {
  const { orderId } = useParams();
  const [searchParams] = useSearchParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const { token } = useCustomerAuthStore.getState();
  // 1. Fetch Order Data
  const fetchOrder = async () => {
    // Get the slug from your store context or URL

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}`,
        {
          headers: {
            "x-store-slug": storeSlug, // Your required header
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await res.json();
      if (data.success) setOrder(data.order);
    } catch (err) {
      toast.error("Could not load order details", {
        containerId: "STOREFRONT",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrder();
  }, [orderId]);


  const handleConfirmDelivery = async () => {
  if (isConfirming) return; // Guard
  setIsConfirming(true);
  
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/orders/${orderId}/confirm-delivery`,
      {
        method: "PATCH",
        headers: {
          "x-store-slug": storeSlug,
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    
    const result = await res.json();

    if (res.ok && result.success) {
      // Refresh the local order state with the new data from backend
      setOrder(result.order); 
      
      toast.success("Delivery confirmed! Thank you.", {
        containerId: "STOREFRONT",
        icon: "✅",
        position: "top-center"
      });
    } else {
      throw new Error(result.message || "Failed to confirm");
    }
  } catch (err) {
    toast.error(err.message, { containerId: "STOREFRONT" });
  } finally {
    setIsConfirming(false);
  }
};
  // 2. Handle Action from Email Link
 // 2. Handle Action from Email Link
useEffect(() => {
  const triggerAction = async () => {
    // Ensure order is loaded, status is shipped, and the URL action is present
    if (
      order?._id && 
      searchParams.get("action") === "confirm" &&
      order?.productStatus === "shipped" &&
      !isConfirming // Prevent double-triggering
    ) {
      // console.log("Auto-confirming delivery from URL action...");
      await handleConfirmDelivery();
      
      // OPTIONAL: Remove the action from URL after confirming so it doesn't re-run on refresh
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("action");
      window.history.replaceState({}, '', `${window.location.pathname}?${newParams.toString()}`);
    }
  };

  triggerAction();
}, [order?._id, order?.productStatus]); // Depend on ID and Status specifically

  if (loading)
    return (
      <Skeleton
        variant="rectangular"
        height={400}
        sx={{ borderRadius: "16px" }}
      />
    );

  if (!token) {
    return (
      <Box
        sx={{
          maxWidth: 500,
          mx: "auto",
          mt: 8,
          p: 4,
          textAlign: "center",
          border: "1px solid",
          borderColor: "neutral.200",
          borderRadius: "xl",
          bgcolor: "background.surface",
          boxShadow: "sm",
        }}
      >
        <Box
          sx={{
            mb: 2,
            display: "inline-flex",
            p: 2,
            bgcolor: "primary.50",
            borderRadius: "50%",
          }}
        >
          <Package size={32} color="#0f172a" />
        </Box>

        <Typography level="h4" sx={{ mb: 1 }}>
          Login to View Order
        </Typography>
        <Typography level="body-sm" sx={{ mb: 3, color: "text.tertiary" }}>
          For your security, you need to be logged in to confirm receipt and
          view transaction details for this order.
        </Typography>

        <Stack spacing={2}>
          <Button
            className="bg-slate-800/90!"
            variant="solid"
            color="primary"
            onClick={() => {
              const currentPath =
                window.location.pathname + window.location.search;
              window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
            }}
            sx={{ fontWeight: 700 }}
          >
            Login to my Account
          </Button>

          <Button
            variant="plain"
            color="neutral"
            onClick={() => (window.location.href = "/")}
          >
            Return to Store
          </Button>
        </Stack>
      </Box>
    );
  }
  return (
    <div>
      <Header
        storeName={storeData?.name}
        storeLogo={storeData?.logo?.url}
        storeData={storeData}
        storeSlug={storeSlug} // Pass the slug
        isStarter={storeData?.plan === "starter"} // Pass the plan check
      />

      <Box sx={{ maxWidth: 800, mx: "auto", p: { xs: 2, md: 4 } }}>
        {/* Status Header */}
        <Card
          variant="soft"
          color="primary"
          sx={{ mb: 3, textAlign: "center", py: 3 }}
        >
          <Typography
            level="body-xs"
            sx={{
              textTransform: "uppercase",
              letterSpacing: "1px",
              fontWeight: 700,
            }}
          >
            Order Status
          </Typography>
          <Typography
            level="h3"
            sx={{
              mt: 1,
              mb: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
            }}
          >
            {/* Use ?. and provide fallbacks */}
            {order?.productStatus === "delivered" ? (
              <CheckCircle2 color="#10b981" />
            ) : (
              <Package />
            )}
            {(order?.productStatus || "Loading...").toUpperCase()}
          </Typography>

          {order?.productStatus === "shipped" && (
            <Button
              variant="solid"
              color="success"
              size="lg"
              loading={isConfirming}
              onClick={handleConfirmDelivery}
              startDecorator={<CheckCircle2 />}
              sx={{ fontWeight: 800, px: 4, borderRadius: "12px" }}
            >
              I HAVE RECEIVED THIS ORDER
            </Button>
          )}
        </Card>

        <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
          {/* Order Info */}
          <Box sx={{ flex: 2 }}>
            <Typography level="title-lg" sx={{ mb: 2 }}>
              Order Items
            </Typography>
            <Stack spacing={2}>
              {order?.items.map((item, i) => (
                <Card
                  key={i}
                  orientation="horizontal"
                  variant="outlined"
                  sx={{ gap: 2 }}
                >
                  <AspectRatio
                    ratio="1"
                    sx={{ width: 80, borderRadius: "8px" }}
                  >
                    <img
                      src={
                        item.product?.images[i].url ||
                        "https://via.placeholder.com/80"
                      }
                      alt={item.name}
                    />
                  </AspectRatio>
                  <Box>
                    <Typography level="title-md">{item.name}</Typography>
                    <Typography level="body-sm">
                      Qty: {item.quantity} × ₦{item.price.toLocaleString()}
                    </Typography>
                  </Box>
                </Card>
              ))}
            </Stack>
          </Box>

          {/* Shipping Summary */}
          <Box sx={{ flex: 1 }}>
            <Card variant="outlined" sx={{ bgcolor: "background.surface" }}>
              <Typography
                level="title-md"
                sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}
              >
                <Truck size={18} /> Delivery Address
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Typography level="body-sm" sx={{ fontWeight: 600 }}>
                {order?.shippingAddress.label}
              </Typography>
              <Typography level="body-sm">
                {order?.shippingAddress.street}
              </Typography>
              <Typography level="body-sm">
                {order?.shippingAddress.city}, {order?.shippingAddress.state}
              </Typography>
              <Typography
                level="body-xs"
                sx={{ mt: 1, color: "text.tertiary" }}
              >
                Tel: {order?.shippingAddress.phone}
              </Typography>

              <Typography
                level="title-sm"
                sx={{
                  mt: 3,
                  mb: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Calendar size={18} /> Order Summary
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Stack direction="row" justifyContent="space-between">
                <Typography level="body-sm">Total</Typography>
                <Typography level="title-md" color="primary">
                  ₦{order?.totalAmount.toLocaleString()}
                </Typography>
              </Stack>
            </Card>
          </Box>
        </Stack>
      </Box>

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
