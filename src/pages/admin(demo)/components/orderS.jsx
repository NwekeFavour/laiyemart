import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Stack,
  Divider,
  Card,
  AspectRatio,
} from "@mui/joy";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  ShoppingBag,
  ReceiptText,
  ExternalLink,
  Package,
} from "lucide-react";
import { useStoreProfileStore } from "../../../store/useStoreProfile";
import { useCustomerAuthStore } from "../../../store/useCustomerAuthStore";
import { getSubdomain } from "../../../../storeResolver";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const subdomain = getSubdomain();
  const reference = searchParams.get("reference");
  const [status, setStatus] = useState("loading");
  const [orderDetails, setOrderDetails] = useState(null);

  // Dynamically get the specific shop's data (Logo, Name, Theme Color)
  const { storeData } = useStoreProfileStore();
  const brandColor = storeData?.themeColor || "#ef4444"; // Fallback to Layemart Red

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference) {
        setStatus("error");
        return;
      }
      try {
        const API_URL =
          import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
        const { token } = useCustomerAuthStore.getState();
        const res = await fetch(`${API_URL}/api/paystack/verify/${reference}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-store-slug": subdomain,
          },
        });
        const data = await res.json();
        if (data.success) {
          setOrderDetails(data.order);
          setStatus("success");
        } else {
          setStatus("error");
        }
      } catch (err) {
        setStatus("error");
      }
    };
    verifyPayment();
  }, [reference]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: `linear-gradient(180deg, ${brandColor}10 0%, #ffffff 100%)`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 3,
      }}
    >
      <AnimatePresence mode="wait">
        {status === "loading" ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Stack alignItems="center" spacing={2}>
              <CircularProgress
                variant="soft"
                sx={{ "--CircularProgress-trackThickness": "4px" }}
                style={{ color: brandColor }}
              />
              <Typography
                level="body-sm"
                sx={{ letterSpacing: "2px", textTransform: "uppercase" }}
              >
                Securing Transaction...
              </Typography>
            </Stack>
          </motion.div>
        ) : status === "success" ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ width: "100%", maxWidth: "450px" }}
          >
            {/* Store Branding Header */}
            <Stack alignItems="center" spacing={1} sx={{ mb: 4 }}>
              {storeData?.logo?.url ? (
                <img
                  src={storeData.logo.url}
                  alt={storeData.name}
                  style={{ height: "40px", objectFit: "contain" }}
                />
              ) : (
                <Typography
                  level="h4"
                  sx={{ fontWeight: 900, letterSpacing: "-1px" }}
                >
                  {storeData?.name}
                </Typography>
              )}
            </Stack>

            <Card
              variant="plain"
              sx={{
                borderRadius: "24px",
                p: 4,
                boxShadow: "0 40px 80px -20px rgba(0,0,0,0.08)",
                border: "1px solid rgba(0,0,0,0.05)",
                background: "rgba(255, 255, 255, 0.9)",
                backdropFilter: "blur(20px)",
              }}
            >
              <Stack alignItems="center" spacing={2}>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <CheckCircle size={60} color="#22c55e" strokeWidth={1.5} />
                </motion.div>

                <Box textAlign="center">
                  <Typography level="h3" sx={{ fontWeight: 800 }}>
                    Order Confirmed
                  </Typography>
                  <Typography level="body-sm">
                    We've sent a receipt to {orderDetails?.customerEmail}
                  </Typography>
                </Box>

                {/* Digital Receipt Look */}
                <Box
                  sx={{
                    width: "100%",
                    mt: 2,
                    p: 2,
                    borderRadius: "16px",
                    bgcolor: "#f8fafc",
                    border: "1px dashed #cbd5e1",
                  }}
                >
                  <Stack spacing={1}>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography
                        level="body-xs"
                        sx={{ fontWeight: 600, color: "#64748b" }}
                      >
                        TRANSACTION REF
                      </Typography>
                      <Typography level="body-xs" sx={{ fontWeight: 700 }}>
                        {reference?.toUpperCase()}
                      </Typography>
                    </Box>
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography
                        level="body-xs"
                        sx={{ fontWeight: 600, color: "#64748b" }}
                      >
                        AMOUNT PAID
                      </Typography>
                      <Typography level="body-sm" sx={{ fontWeight: 800 }}>
                        ₦{orderDetails?.totalAmount?.toLocaleString()}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Stack spacing={1} sx={{ width: "100%", mt: 2 }}>
                  <Button
                    size="lg"
                    // Just use '/shop'. The browser already knows you are on the subdomain.
                    onClick={() => navigate("/shop")}
                    sx={{
                      bgcolor: brandColor,
                      "&:hover": { bgcolor: brandColor, opacity: 0.9 },
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                    startDecorator={<ShoppingBag size={18} />}
                  >
                    Continue Shopping
                  </Button>

                  <Button
                    variant="plain"
                    color="neutral"
                    startDecorator={<ReceiptText size={18} />}
                    // This will take them to nike.layemart.com/account
                    onClick={() => navigate("/account")}
                  >
                    View My Orders
                  </Button>
                </Stack>
              </Stack>
            </Card>

            {/* Platform Footer */}
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              spacing={1}
              sx={{ mt: 4, opacity: 0.5 }}
            >
              <Typography level="body-xs">SECURED BY</Typography>
              <Typography
                level="body-xs"
                sx={{ fontWeight: 900, color: "#ef4444" }}
              >
                LAYEMART
              </Typography>
            </Stack>
          </motion.div>
        ) : (
          /* Error State UI */
          <Stack alignItems="center" spacing={2}>
            <Typography level="h4">Payment Verification Failed</Typography>
            <Button variant="outlined" onClick={() => navigate("/cart")}>
              Try Again
            </Button>
          </Stack>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default OrderSuccess;
